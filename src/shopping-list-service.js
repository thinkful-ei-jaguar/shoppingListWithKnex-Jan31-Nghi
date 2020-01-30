// Instantiate service for object export
const ShoppingService = {
    // Get shopping list
    getList(knex) {
        return knex
        .select('*')
        .from('shopping_list');
    },
    // Insert shopping item
    insertItem(knex, item) {
        // return all the data that is being inserted
        // which is 1
        return knex('shopping_list')
            .insert(item)
            .returning('*')
            .then(rows => rows[0]);
    },
    // Get shopping by id
    getItem(knex, id) {
        return knex
            .select('*')
            .from('shopping_list')
            .where('id', id)
            .first();
    },
    // Update shopping item
    updateItem(knex, id, item) {
        return knex('shopping_list')
            .where({id})
            .update(item);
    },
    // Remove shopping item
    deleteItem(knex, id) {
        return knex('shopping_list')
            .where({id})
            .delete();
    }
};

module.exports = ShoppingService;