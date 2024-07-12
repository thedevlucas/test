const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.get('/login', async (req, res) => {
        if (auth.isAuthenticated(functions.getCookie(req, "token"))) return res.redirect(`/user/panel`);
        if ((await auth.login(req, res, {token: functions.getCookie(req, "token")})).status) return res.redirect(`/user/panel`);

        res.render('global/login', {});
    });
    router.post('/login', async (req, res) => {
        const body = req.body;
        const result = await auth.login(req, res, {username: body.username, password: body.password})
        if (!result.status) return res.render('global/login', {error: result.info});

        res.redirect(`/user/panel`);   
    });
}