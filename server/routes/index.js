const express = require('express');
const db = require('../db')
const bcrypt = require("bcrypt")

const router = express.Router()

router.get('/user/:userID', async (req, res, next) => {
    try {
        let results = await db.allConfigsForUser(req.params.userID);
        res.json(results)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        console.log("IN :/id", req.params.id)
        let results = await db.getOneConfig(req.params.id);
        res.json(results[0])
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/addConfig', async (req, res, next) => {
    try {
        let row = [req.body.dfAgentID, req.body.userID, req.body.agentName, req.body.expand, req.body.intent]
        let results = await db.addConfig(row);
        res.json({
            code: 200,
            type: "SUCCESS_USER_ADDED",
            message: "Successfully added config!",
        })
    } catch(e) {
        console.log(e)
        let errorMessage = "no error message implemented for this code yet";
        if (e.code === 'ER_DUP_ENTRY') {
            errorMessage = "This user already exists!"
        } 
        let error = {
            code: 500,
            type: e.code,
            message: errorMessage
        }
        res.json(error)
    }
})

router.put('/editConfig', async (req, res, next) => {
    try {
        console.log("IN EDIT")
        let row = [req.body.dfAgentID, req.body.userID, req.body.agentName, req.body.expand, req.body.intent, req.body.config]
        let results = await db.editConfig(row);
        res.json({
            code: 200,
            type: "SUCCESS_CONFIG_UPDATED",
            message: "Successfully updated config!",
        })
    } catch(e) {
        console.log(e)
        let errorMessage = "no error message implemented for this code yet";
        if (e.code === 'ER_DUP_ENTRY') {
            errorMessage = "This user already exists!"
        } 
        let error = {
            code: 500,
            type: e.code,
            message: errorMessage
        }
        res.json(error)
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
            code: 200,
            type: "SUCCESS_USER_ADDED",
            message: "Successfully added user!",
            userID: results.insertId,
            email: results[0].email
        })
    } catch(e) {
        console.log(e)
        let errorMessage = "no error message implemented for this code yet";
        if (e.code === 'ER_DUP_ENTRY') {
            errorMessage = "This user already exists!"
        } 
        let error = {
            code: 500,
            type: e.code,
            message: errorMessage
        }
        res.json(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        console.log("IN ENDPOINT")
        console.log(req.body.email)
        let results = await db.login(req.body.email);
        console.log("RESULTS", results)
        if (results.length > 0) {
            if (await bcrypt.compare(req.body.password, results[0].password)) {
                console.log('user is authenticated!')
                res.json({
                    code: 200,
                    type: "SUCCESS_LOGIN",
                    message: "Successfully authenticated user!",
                    userID: results[0].userID,
                    email: results[0].email
                })
            } else {
                console.log("error authenticating user")
                res.json({
                    code: 500,
                    type: "ERR_INCORRECT_PASSWORD",
                    message: "Incorrect password entered."
                })
            }
        } else {
            res.json({
                code: 500,
                type: "ERR_EMAIL_NOT_FOUND",
                message: "Email not registered."
            })
        }
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router;