const jwt = require("jsonwebtoken")
const axios = require("axios")

const UserModel = require('./../models/UserModel')
const CollegeModel = require('./../models/CollegeModel')

const loginAction = async (req, res) => {
    const {googleAccessToken} = req.body;

    axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            "Authorization": `Bearer ${googleAccessToken}`
        }
    })
        .then(async response => {
            const firstName = response.data.given_name;
            const name = response.data.name;
            const emailId = response.data.email;
            const picture = response.data.picture;
            const sub = response.data.sub;

            let findUser = await UserModel.findOne({emailId})
            console.log('check 1')
            if (!findUser) {
                try{
                    const newUser = {
                        googleId: sub,
                        displayName: name,
                        firstName: firstName,
                        image: picture,
                        emailId,
                    }

                    findUser = new UserModel(newUser);
                    await findUser.save();

                }catch (err){
                    res.status(500).json(err);
                }
            }

            const token = jwt.sign({
                email: findUser.emailId,
                id: findUser._id
            }, process.env.JWT_SECRET);

            res
                .status(200)
                .json({user: findUser, token})
                
        })
        .catch(err => {
            res
                .status(400)
                .json({message: "Invalid access token!"})
        })

}

const collegeInputAction = async(req,res) => {
    try{
        const findUser = req.user;
        const collegeName=req.body.collegeName;
        findUser.collegeName = collegeName;
        findUser.save();
        res.status(200).json({message:"College updated successfully"})
    }catch(error){
        res.status(500).json({message:"Please try Again"})
    }
}

module.exports = {
    loginAction,
    collegeInputAction,
}