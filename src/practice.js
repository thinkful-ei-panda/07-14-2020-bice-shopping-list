require('dotenv').config();
const knex=require('knex');

const knexInstance=knex({
  client:'pg',
  connection: process.env.DB_URL
});

function searchByItemName(searchTerm){
  knexInstance
    .select('*')
    .from('shoppinglist')
    .where('name','ILIKE',`%${searchTerm}%`)
    .then(result=>{
      console.log('SEARCH TERM',{searchTerm});
      console.log(result);
    });
}

//searchByItemName('urger');

function paginateItems(page){
  const limit=6;
  const offset=limit*(page-1);
  knexInstance
    .select('*')
    .from('shoppinglist')
    .limit(limit)
    .offset(offset)
    .then(result=>{
      console.log('PAGINATE ITEMS',{page});
      console.log(result);
    });
}

//paginateItems(2);

function productsAddedDaysAgo(daysAgo){
  knexInstance
    .select('id','name','price','date_added','checked','category')
    .from('shoppinglist')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`,daysAgo)
    )
    .then(results=>{
      console.log('PRODUCTS ADDED DAYS AGO');
      console.log(results);
    });
}

//productsAddedDaysAgo(5);

function costPerCategory(){
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shoppinglist')
    .groupBy('category')
    .then(result=>{
      console.log('COST PER CATEGORY');
      console.log(result);
    });
}

//costPerCategory();

function sumItemCategories(){
  knexInstance('shoppinglist')
    .select('category')
    .count('name AS items')
    .sum('price AS total')
    .select(knexInstance.raw('ROUND(AVG(price), 2) AS average'))
    .groupBy('category')
    .then(res=>console.log(res));
}

sumItemCategories()