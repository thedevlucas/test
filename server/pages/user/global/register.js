const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

module.exports = (router, database) => 
{
    router.get('/register', async (req, res) => {
        res.render('global/register', {});
    });
    router.post('/register', async (req, res) => {
        const Body = req.body;
        const con = mysql.createConnection(database);

        try {
            if (Body.username < 4 && Body.password < 4)
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

            const [results] = await con.promise().query(`SELECT id FROM users WHERE username = ?`, [Body.username])
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

                con.end();
                return 
            }

            const passwordHash = await bcrypt.hash(Body.password, 10);
            const [results2] = await con.promise().query('INSERT INTO `users` SET ?', {username: Body.username, password: passwordHash})

            con.end();

            res.render("global/register", {
                alert: {
                    title: "Done",
                    message: "User created",
                    icon: "success",
                    showConfirmButton: true,
                    time: 5000,
                    ruta: ""
                }
            });
        } catch (error) {
            console.log(error);
            con.end();

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
        }
    });
}