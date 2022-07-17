const express = require('express');
const db = require('../db')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/all', async (req, res, next) => {
    try {
        let results = await db.allConfigsForUser();
        res.json(results)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let results = await db.getOneConfig(req.params.id);
        res.json(results)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/addConfig', async (req, res, next) => {
    try {
        let row = [req.body.dfAgentID, req.body.userID, req.body.agentName]
        let results = await db.addConfig(row);
        res.json(results)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/addUser', async (req, res, next) => {
    try {
        const email = req.body.email;
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        let row = [email, hashedPassword]
        let results = await db.addUser(row);
        console.log(results)
        res.json({
            code: "SUCCESS_USER_ADDED",
            message: "Successfully added user!",
            userID: results.insertId
        })
    } catch(e) {
        console.log(e)
        let errorMessage = "no error message implemented for this code yet";
        if (e.code === 'ER_DUP_ENTRY') {
            errorMessage = "This user already exists!"
        } 
        let error = {
            error_code: e.code,
            error_message: errorMessage
        }
        res.json(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        console.log("IN ENDPOINT")
        let results = await db.login(req.body.email);
        console.log("RESULTS", results)
        if (results.length > 0) {
            if (await bcrypt.compare(req.body.password, results[0].password)) {
                console.log('user is authenticated!')
                res.json({
                    code: "SUCCESS_LOGIN",
                    message: "Successfully authenticated user!",
                    userID: results[0].userID
                })
            } else {
                console.log("error authenticating user")
                res.json({
                    code: "ERR_INCORRECT_PASSWORD",
                    message: "Incorrect password entered."
                })
            }
        } else {
            res.json({
                code: "ERR_EMAIL_NOT_FOUND",
                message: "Email not registered."
            })
        }
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;