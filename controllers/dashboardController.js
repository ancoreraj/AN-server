
const CollegeModel = require('./../models/CollegeModel');
const PdfModel = require('../models/PdfModel')

const getColleges = async (req, res) => {
    try {
        const colleges = await CollegeModel.find({});
        res.json({ colleges });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const topContributorsAction = async (req, res) => {
    try {
        let { collegeName } = req.body; 

        console.log(collegeName)
        const collegeData = await CollegeModel.findOne({ collegeName }).populate('topPerformer')
        if (!collegeData) {
            return res.status(400).json({ message: 'Invalid college name' });
        }
        collegeData.topPerformer=collegeData.topPerformer.slice(0,5)
        

        return res.status(200).json({ collegeDetails: collegeData });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const uploadNotesAction = async (req, res) => {
    try {
        const {
            driveUrl,
            title,
            year,
            branch,
        } = req.body;

        const { collegeName } = req.user
        const foundCollege = await CollegeModel.findOne({ collegeName }).populate('topPerformer');
        
        if (!foundCollege) {
            return res.status(400).json({ message: 'Invalid College' });
        }

        const pdf = new PdfModel({
            title: title,
            driveUrl: driveUrl,
            college: req.user.collegeName,
            year: year,
            branch: branch,
            user: req.user.id,
            userName: req.user.firstName,
        })

        await pdf.save()

        req.user.pdfs.push(pdf)
        await req.user.save();

        const {topPerformer}  = foundCollege;
        let check = false;
        topPerformer.map(user => {
            if(String(user._id) === String(req.user._id)){
                check = true;
            }
        });

        if (!check) {
            topPerformer.push(req.user);
        }

        topPerformer.sort((a, b) => b.pdfs.length - a.pdfs.length);
        foundCollege.topPerformer = topPerformer;

        foundCollege.save();

        res.status(200).json({ message : 'File Uploaded Sucessfully'});
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const inputBulkCollegesAction = async (req, res) => {
    try {
        const { colleges } = req.body;
        await CollegeModel.insertMany(colleges);

        res.status(200).json({ message: 'ok' });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

const getPdfs = async (req, res) => {
    try{
        let { year, branch } = req.query;
        year = Number(year);

        const pdfs = await PdfModel.find({ year, branch});
        if(pdfs.length === 0){
            res.status(400).json({ message: "Pdfs not found"});
        }

        res.status(200).json({ pdfs: pdfs});
    }catch(err){
        res.status(500).json({ message: "Something went wrong" })
    }
};

module.exports = {
    getColleges,
    inputBulkCollegesAction,
    topContributorsAction,
    uploadNotesAction,
    getPdfs
}