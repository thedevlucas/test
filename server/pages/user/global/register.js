const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

module.exports = (router, database) => 
{
    router.get('/register', async (req, res) => {
        if (auth.isAuthenticated(functions.getCookie(req, "token"))) return res.redirect(`/user/panel`);
        if ((await auth.login(req, res, {token: functions.getCookie(req, "token")})).status) return res.redirect(`/user/panel`);
        
        res.render('global/register', {});
    });
    router.post('/register', async (req, res) => {
        const body = req.body;
        const con = mysql.createConnection(database);

        try {
            if (body.username < 4 && body.password < 4)
            {
                res.render("global/register", {
                    alert: {
                        title: "Error",
                        message: "Incorrect data",
                        icon: "error",
                        showConfirmButton: true,
                        time: 5000,
                        ruta: "register"
                    }
                });
            }

            const [results] = await con.promise().query(`SELECT id FROM users WHERE username = ?`, [body.username]);
            if (results[0])
            {
                res.render("global/register", {
                    alert: {
                        title: "Error",
                        message: "Username already exist",
                        icon: "error",
                        showConfirmButton: true,
                        time: 5000,
                        ruta: "register"
                    }
                });

                return;
            }

            const passwordHash = await bcrypt.hash(body.password, 10);
            const [results2] = await con.promise().query('INSERT INTO `users` SET ?', {username: body.username, password: passwordHash});

            res.render("global/register", {
                alert: {
                    title: "Done",
                    message: "User created",
                    icon: "success",
                    showConfirmButton: true,
                    time: 5000,
                    ruta: "login"
                }
            });
        } catch (error) {
            console.error(error);

            res.render("global/register", {
                alert: {
                    title: "Error",
                    message: "Server error",
                    icon: "error",
                    showConfirmButton: true,
                    time: 5000,
                    ruta: "register"
                }
            });
        } finally {
            con.end();
        }
    });
}