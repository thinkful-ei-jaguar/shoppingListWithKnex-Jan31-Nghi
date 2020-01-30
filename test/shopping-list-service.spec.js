// Require module for testing
const ShoppingList = require('../src/shopping-list-service');
// Require pg
const pg = require('pg');
// Postgres can handle big numbers but JS can't, so fractions and decimals are converted to string when retrieved
// Allows postgres to return both integer and fractional data type
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
// Require knex for test db configuration
const knex = require('knex');

describe('ShoppingService object', function() {
    let db;
    let testList = [
        {
            id: 1,
            name: 'cheese',
            price: 1.99,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'
        },
        {
            id: 2,
            name: 'tuna',
            price: 3.02,
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 3,
            name: 'cereal',
            price: 5.99,
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        }
    ];
    // Hooks in mocha to connect to the database
    before(() => db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL
    }));
    // Clears previous data in the table
    before(() => db('shopping_list').truncate());
    afterEach(() => db('shopping_list').truncate());
    
    // Disconnect the data
    after(() => db.destroy());

    


    context(`Given shopping list has data`, () => {
        // Insert test data before each it()
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testList);
        });
        // Test - gets list
        it(`getList() resolves all shopping items from 'shopping_list' table`, () => {
            return ShoppingList
                .getList(db)
                .then(actual => {
                    expect(actual).to.eql(testList);
            });
                
        });
        // Test - find id
        it(`getItem() resolves an item by item from 'shopping_list' table`, () => {
            const id = 3; 
            return ShoppingList
                .getItem(db, id)
                .then(actual => {
                    expect(actual).to.eql(testList[2]);
                });
        });
        // Test - delete
        it(`deleteItem() removes an item by id`, () => {
            const id = 1;
            return ShoppingList
                .deleteItem(db, id)
                .then(() => ShoppingList.getList(db))
                .then(actual => {
                    const expected = testList.filter(i => i.id !== id);
                    expect(actual).to.eql(expected);
                });
        });
        // Test - update
        it(`updateItem() resolved an updated item`, () => {
            const id = 2;
            const testItem = {
                name: 'canned tuna',
                price: 3.00,
                date_added: new Date(),
                checked: false,
                category: 'Snack'
            };
            return ShoppingList
                .updateItem(db, id, testItem)
                .then(() => ShoppingList
                    .getItem(db, id))
                .then(actual => {
                    expect(actual).to.eql({
                        id,
                        ...testItem
                    });
                });
        });

    });




    context(`Given shopping list has no data`, () => {
        it('returns empty array', () => {
            return ShoppingList
                .getList(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });
    });


    // Test - insert
    context(`insertItem()`, () => {
        it('create item when all data is provided', () => {
            const testItem = { ...testList[0]};
            // Id is autocreated
            delete testItem.id;
            return ShoppingList
                .insertItem(db, testItem)
                .then(item => {
                    expect(item).to.be.an('object');
                    expect(item.name).to.eql(testItem.name);
                    expect(item.date_added).to.eql(testItem.date_added);
                    expect(item.price).to.eql(testItem.price);
                    expect(item.category).to.eql(testItem.category);
                    expect(item).to.have.property('id');
                    expect(item).to.have.property('checked');
                });
        });

        it('errors on create when any 1 field is not provided', () => {
            const testItem = { ...testList[0]};
            delete testItem.id;
            // Remove title to force an error
            delete testItem.name;
            return ShoppingList
                .insertItem(db, testItem)
                .then(
                    () => expect.fail(),
                    err => {
                        expect(err.message).to.include('not-null');
                    });
        });
    });
});



