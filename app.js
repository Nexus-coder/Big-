const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/camp');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/CampGrounds')
.then(()=>{
    console.log("Server opened!!");
})
.catch((err)=>{
    console.log(err);
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connecton error:"));
db.once("open",()=>{
    console.log("Database connected")
})

const app = express();

app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//Middleware
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

//All Campgrounds
app.get('/makeGrounds',async (req,res)=>{
const campgrounds = await Campground.find({});
res.render('campgrounds/home', {campgrounds})
})

//Add a new campground.
app.get('/makeGrounds/new',(req,res)=> {
    res.render('campgrounds/new')
})

//Show Campground-POST.
app.get('/makeGrounds/:id',catchAsync(async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id)
    res.render('campgrounds/show', {camp})
}))

//Posting New Campground
app.post('/makeGrounds',catchAsync(async (req,res) => {
    console.log(req.body)
    const camp = new Campground(req.body);
    await camp.save()
    res.redirect(`/makeGrounds/${camp._id}`);

}))

//Edit form for campground
app.get('/makeGrounds/:id/edit',catchAsync(async(req,res) => {
    const {id}= req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground})
}))

//Post editted campground
app.put('/makeGrounds/:id',catchAsync(async(req,res) => {
    const {id}= req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body,{new:true})
    res.redirect(`/makeGrounds/${id}`);
}))

//Delete route
app.delete('/makeGrounds/:id',catchAsync(async (req,res) => {
    const {id} =req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/makeGrounds');
}))

app.all('*',(req,res,next) => {
next(throw new ExpressError('Page not Found',404))
})

app.use((err,req,res,next) => {
    const {statusCode,message} = err;
    res.status(statusCode).send(message);
    res.send("Oooh boy something went wrong");

})

//Open local server
app.listen(3000,()=>{
    console.log("opened on port 3000")
})