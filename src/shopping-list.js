// Required created environment variables
require('dotenv').config();
const ShoppingList = require('./shopping-list-service');

// Require library to access database
const knex = require('knex');

// Create knex instance with the database configuration
const db = knex({
    // Specify driver for Postgres - type of database
    client: 'pg',
    // Specify database to connect to
    connection: process.env.DB_URL
});

ShoppingList.getList(db)
    .then(list => console.log(list))
    .then(() => {
        return ShoppingList.insertItem(db, {
            name: 'new item',
            price: 1.99,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        });
    })
    .then( newItem => {
        return ShoppingList.updateItem(
            db,
            newItem.id,
            {
                name: 'updated item',
                price: 1.99,
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                checked: true,
                category: 'Snack'
            }
        ).then(() => ShoppingList.getItem(db, newItem.id));
    })
    .then(item => {
        return ShoppingList.deleteItem(db, item.id);
    });