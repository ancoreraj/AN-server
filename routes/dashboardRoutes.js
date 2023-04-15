const express = require('express');
const ensureAuth = require('../config/ensureAuth');
const router = express.Router()

const { 
    getColleges, 
    inputBulkCollegesAction, 
    topContributorsAction, 
    uploadNotesAction,
    getPdfs
} = require("../controllers/dashboardController")

router.get("/colleges", getColleges);

router.post('/inputBulkColleges', inputBulkCollegesAction);

router.post('/top', topContributorsAction);

router.post('/uploadNotes', ensureAuth, uploadNotesAction);

router.post('/pdfs', getPdfs);

module.exports = router
