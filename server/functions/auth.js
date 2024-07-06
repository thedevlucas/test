const config = require('../../config.json');
const functions = require('./functions');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcrypt = require("bcryptjs");

//Database Info
const database = {
    host: config.db.host, 
    user: config.db.user, 
    password: config.db.pass,
    database: config.db.db
}

module.exports.clientData = [];
let sequence = 1;

module.exports.login = async (req, res, loginInfo) => 
{
    const con = mysql.createConnection(database);
    try {
        let token;
        let sessionId;
        let query = `SELECT * FROM users WHERE username = ${con.escape(loginInfo.username)}`;

        if (loginInfo.token)
        {
            
            let decodedToken = jwt.verify(loginInfo.token, config.auth.secret);

            if (!decodedToken.sessionId)
            {
                con.end();
                return {status: false, err: 1, info: "Bad token"};
            }

            token = loginInfo.token;
            sessionId = decodedToken.sessionId;

            query = `SELECT *, u.id, s.id AS sessionId FROM users u JOIN sessions s on u.id = s.userId WHERE s.id = ${decodedToken.sessionId}`;
        }

        const [results, fields] = await con.promise().query(query);
        let result = results[0];

        if (!result)
        {
            con.end();
            return {status: false, err: 1, info: "User not found"};
        }
        
        if (loginInfo.password)
        {
            if (!await bcrypt.compare(loginInfo.password, result.password)) 
            {
                con.end();
                return {status: false, err: 4, info: "Incorrect password"};
            }
        } 

        if (!token) {
            // const [results, fields] = await con.promise().query(`SELECT * FROM sessions WHERE userId = ${result.id}`);
            
            // if (results.length >= 3) 
            // {
            //     const [results, fields] = await con.promise().query(`DELETE FROM sessions WHERE userId = ${result.id}`);
            // }

            const [results3, fields3] = await con.promise().query(`INSERT INTO sessions (userId, device, application, ip) VALUES (?, ?, ?, ?)`, [result.id, req.useragent.platform, req.useragent.browser, functions.getIp(req)]);
            
            token = jwt.sign({id: result.id, username: result.username, sessionId: results3.insertId}, config.auth.secret, {})
            sessionId = results3.insertId;

            res.cookie("token", token, {
                expires: new Date("01-01-5000")
            })
        }

        con.end();

        this.clientData.push({
            res,
            token: token,
            sessionId: sessionId,
            clientNo: sequence++
        });

        return {status: true, err: 0, info: "Logged successfully", data: {id: result.id, token: token}};
    } catch (error) {
        console.log(error)
        con.end(); 
        return {status: false, err: 500, info: "Server error"};
    }
}

module.exports.logout = async (token, all) => 
{
    this.clientData = this.clientData.filter(user => user.token !== token);

    const con = mysql.createConnection(database);

    try {
        let decodedToken = jwt.verify(token, config.auth.secret);
      
        if (!!decodedToken.sessionId)
        {
            con.end();
            return false;
        }

        if (all)
        {
            const [results, fields] = await con.promise().query(`SELECT u.id FROM users u JOIN sessions s on u.id = s.userId WHERE s.id = ${decodedToken.sessionId}`);
            let result = results[0];

            if (!result) 
            {
                con.end();
                return false;
            }

            const [results2, fields2] = await con.promise().query(`DELETE FROM sessions WHERE userId = ${result.id}`);
        }
        else 
        {
            const [results, fields] = await con.promise().query(`DELETE FROM sessions WHERE id = ${decodedToken.sessionId}`);
        }
        
        con.end();
        return true;
    } catch (error) {
        console.log(error)
        con.end();
        return false;
    }
}

module.exports.logoutData = async (data) =>
{
    if (data == undefined) return false;

    for (let user of this.clientData)
    {
        try {
            const decoded = jwt.verify(user.token, config.auth.secret);

            if (decoded.cuil == data || decoded.id == data)
            {
                return await this.logout(user.token);
            }
        }
        catch (error) 
        { 
            return await this.logout(user.token);
        }
    }

    return false;
}

module.exports.logoutSession = async (req, id) =>
{
    if (id == undefined) return false;

    const con = mysql.createConnection(database);
    try {
        const [results, fields] = await con.promise().query(`SELECT u.id FROM users u JOIN sessions s on u.id = s.userId WHERE s.token = ${con.escape(functions.getCookie(req, "token"))}`);
        let result = results[0];

        const [results2, fields2] = await con.promise().query(`DELETE FROM sessions WHERE id = ${con.escape(id)} AND userId = ${result.id}`);

        this.clientData = this.clientData.filter(x => x.sessionId != id);

        return true
    } catch (error) {
        con.end();
        console.log(error);
    }

    return false;
}

module.exports.verifyToken = async (token) =>
{
    if (token == undefined) return false;

    for (user of this.clientData) {
        if (user.token == token) return true;
    }

    return false;
}