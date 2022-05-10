const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs");
const multer = require("multer");
const cookieParser = require("cookie-parser")
const flash = require('connect-flash')


const static_path = path.join(__dirname, "../public");

require("dotenv").config();
require("./db/conn.js")
const User = require("./models/users")
var bodyParser = require("body-parser");
const http = require("http");
// const async = require("hbs/lib/async");
const res = require("express/lib/response");
const port = process.env.PORT || 3000;
const auth = require("./middleware/auth");
const { getMaxListeners } = require("process");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())
app.use(express.static(static_path));
app.use(cookieParser())

// var urlencodedParser=bodyParser.urlencoded({extended: true});

const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const uploadPath = path.join(__dirname, "../uploads");
app.set("view engine", "ejs");
app.set("views", templatePath)
// hbs.registerPartials(partialPath);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
//   console.log(storage)

var upload = multer({ storage: storage })
console.log(storage, "emdwijlk")

console.log("upload path: ", uploadPath)
app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", upload.single('image'), async (req, res, next) => {
    try {

        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        const email = req.body.email;
        const emailfound = await User.findOne({ email: email })
        if (emailfound == null) {
            console.log("password: ", password, " c p: ", confirm_password)
            if (password == confirm_password) {
                console.log("hmlo")
                // console.log(path.join(uploadPath, req.file.filename))
              
                console.log("upload path: ", uploadPath)
                
                if(typeof req.file!="undefined"){
                const userdata = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    address: req.body.address,
                    dob: req.body.dob,
                   
                    photo: { data: fs.readFileSync(path.join(uploadPath, req.file.filename)), contentType: 'image/png' },
                   
                    password: req.body.password,
                    gender: req.body.gender
                })
                const token = await userdata.generateAuthToken();
                const registered = await userdata.save();
                res.status(201).render("login");
            }
            else{
                const userdata = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    address: req.body.address,
                    dob: req.body.dob,
                   
                    photo: { data: undefined, contentType: 'image/png' },
                   
                    password: req.body.password,
                    gender: req.body.gender
                }) 
                const token = await userdata.generateAuthToken();
                const registered = await userdata.save();
                res.status(201).render("login");
            }
            }
  
            else {
                res.send("passwords not matching")
            };
        }
        else {
            res.send("user already exists")
        }

    } catch (error) {
        res.status(400).send(error);
    }
})


flag=1;
count=0;
app.post("/login", async (req, res) => {
    try {
        console.log(req.cookies.jwt)

        if (req.cookies.jwt == undefined) {
            if(flag==1){

            
            const password = req.body.password;
            const email = req.body.email;
            const useremail = await User.findOne({ email: email })
            const ismatch = await bcrypt.compare(password, useremail.password)
            console.log(useremail.tokens.length)
            if (useremail.tokens.length < 3) {
                if (ismatch) {
                    const token = await useremail.generateAuthToken();
                    res.cookie("jwt", token, {

                        httpOnly: true
                    })
                
                    if (email == "admin123@gmail.com") {
                        res.status(201).redirect("admin")
                    }
                    else {
                        res.status(201).redirect("secret")
                    };
                }
                else {
                    count+=1
                    setTimeout(function(){
                        count--;
                    },5*60*1000)
                    if(count>=3)
                    {
                            count=0;
                            flag=0;
                            setTimeout(function(){
                                flag=1;
                            },5*60*1000)
                    }
                    
                    res.send("invald login")
                }
            }

            else {
                res.send("More than 2 concurret logins not allowed")
            }
        }
        else{
            res.send("Login blocked for 5 mins after 3 wrong passwords")
        }
    }
        else {
            res.send("You are already logged in")
        }



    } catch (error) {
        res.status(400).send(error);
    }

})
app.get('/secret', auth, (req, res) => {
    console.log(`cookie: ${req.cookies.jwt}`)
    res.render("secret")
})
app.get('/admin', auth, (req, res) => {
    // console.log(`cookie: ${req.cookies.jwt}`)
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('admin', { users: users });
        }
    });

})
app.get('/about', auth, (req, res) => {
    console.log(`cookie: ${req.cookies.jwt}`)
    res.render("about", { user: req.user })
})

app.get('/logout', auth, async (req, res) => {
    // console.log(`cookie: ${req.cookies.jwt}`)
    try {
        req.user.tokens = req.user.tokens.filter((currele) => {
            return currele.token != req.token
        })
        res.clearCookie("jwt")
        console.log("logout")
        await req.user.save();
        res.redirect("login")
    }
    catch (error) {
        res.status(500).send(error)
    }

})

app.listen(port, (req, res) => {
    console.log(`The application is running on port: ${port}`)

});