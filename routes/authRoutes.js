const express = require('express');
const ensureAuth = require('../config/ensureAuth');
const router = express.Router()

const { loginAction, collegeInputAction,topContributors } = require("../controllers/authController")

router.get('/check', (req, res) => {
    res.send('Sever is running fine');
})

router.post("/auth/login", loginAction);
router.post('/collegeinput',ensureAuth, collegeInputAction)

module.exports = router
