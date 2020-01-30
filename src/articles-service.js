// Instantiate service object for export
const ArticlesService = {
    getAllArticles(knex) {
        return knex
            .select('*')
            .from('blogful_articles');
    },
    insertArticle(knex, article) {
        return knex
            .insert(article)
            .into('blogful_articles')
            .returning('*')
            .then(rows => {
                // return the newly added object within the array
                return rows[0];
            });
    },
    getById(knex, id) {
        return knex
            .from('blogful_articles')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteArticle(knex, id) {
        return knex('blogful_articles').where({id}).delete();
    },
    updateArticle(knex, id, newArticle) {
        return knex('blogful_articles').where({id}).update(newArticle);
    }
};

module.exports = ArticlesService;