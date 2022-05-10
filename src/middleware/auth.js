const async = require("hbs/lib/async")
const jwt = require("jsonwebtoken")
const User = require("../models/users")


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY)
        console.log("ver: ",verifyuser)
        const user = await User.findOne({ _id: verifyuser._id })
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send(error)

    }

}
module.exports = auth;