const mysql = require('mysql')

require('dotenv').config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

// will take care of any queries we make!
const conn = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
})

let metahumansDB = {};

// return everything in this db
metahumansDB.allConfigsForUser = (userID) => {
    console.log("USER ID IN FUNC: ", userID)
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM dfConfig WHERE userID = ?', userID, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

metahumansDB.getOneConfig = (configID) => {
    return new Promise((resolve, reject) => {
        console.log("IN GET ONE CONFIG FUNCTION")
        // question mark prevents sql injections!
        conn.query('SELECT * FROM dfConfig WHERE configID = ?', configID, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

metahumansDB.addConfig = (row) => {
    return new Promise((resolve, reject) => {
        console.log("about to add config!")
        // question mark prevents sql injections!
        conn.query('INSERT INTO dfConfig (dfAgentID, userID, agentName, expand, intent) VALUES (?)', [row], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

metahumansDB.editConfig = (row) => {
    return new Promise((resolve, reject) => {
        console.log("about to add config!")
        // question mark prevents sql injections!
        conn.query('UPDATE dfConfig SET dfAgentID = ?, userID = ?, agentName= ?, expand= ?, intent= ? WHERE configID = ?', [row], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

metahumansDB.addUser = (row) => {
    return new Promise((resolve, reject) => {
        console.log("about to add user!")
        // question mark prevents sql injections!
        conn.query('INSERT INTO users (email, password) VALUES (?)', [row], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

metahumansDB.login = (email) => {
    return new Promise((resolve, reject) => {
        console.log("about to authenticate user!")
        console.log(email)
        // question mark prevents sql injections!
        conn.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

module.exports = metahumansDB