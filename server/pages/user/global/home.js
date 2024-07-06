const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        res.render('global/home', {});
    });
}