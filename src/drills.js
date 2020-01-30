// Required created environment variables
require('dotenv').config();

// Require library to access database
const knex = require('knex');

// Create knex instance with the database configuration
const db = knex({
    // Specify driver for Postgres - type of database
    client: 'pg',
    // Specify database to connect to
    connection: process.env.DB_URL
});

console.log('knex and driver installed correctly');





// Build our query

// Drill #1
function searchByText(searchTerm) {
    db
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => console.log(result));
}

// searchByText('fish');

// Drill #2
function paginateList(pageNumber) {
    const limit = 6;
    const offset = (pageNumber-1) * limit;
    db
    .select('id','name', 'price', 'category')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(result => console.log(result));
}

// paginateList(3);

// Drill #3
function recentAddedList(daysAgo) {
    db
    .select('id', 'name', 'price', 'date_added')
    .from('shopping_list')
    .where(
        'date_added',
        '>',
        // ?? is where variable goes
        db.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(result => console.log(result));
}

// recentAddedList(5);

// Drill #4
function totalCost() {
    db
    .select('category')
    .sum('price AS total')
    .from('shopping_list')
    .groupBy('category')
    .orderBy([
        { column: 'category', order: 'DESC'}
    ])
    .then(result => console.log(result));
}

totalCost();