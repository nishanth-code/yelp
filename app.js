const express = require('express');
const  mongoose  = require('mongoose');
const app = express();
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const camp = require('./models/campground');
const { findByIdAndDelete } = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp',{
useNewUrlParser: true,
useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error',console.error.bind('connection error:'))
db.once("open",() => {
    console.log("db connected")
});
app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res) =>{
    res.render('home')
})
app.get('/allcamp', async (req,res) =>{
    const campground = await camp.find({})
    res.render('campground/index' , { campground })
})
app.get('/add_camp', (req,res) => {
    res.render('campground/create')
})
app.post('/add', async (req,res) =>{
    const c= new camp(req.body.campground)
    await c.save()
    res.redirect('/allcamp')
    

})
app.get('/allcamp/:id', async(req,res) =>{
    const c = await camp.findById(req.params.id)
    res.render('campground/show', { c })
})
app.get('/allcamp/:id/edit', async(req,res) => {
    const c = await camp.findById(req.params.id)
    res.render('campground/edit', { c })

})
app.put('/allcamp/:id' , async(req,res) => {
    const campgrnd = await camp.findByIdAndUpdate(req.params.id,{...req.body.campground})
    res.redirect(`/allcamp/${req.params.id}`)
})
app.delete('/allcamp/:id/delete', async(req,res) =>{
    await camp.findByIdAndDelete(req.params.id)
    res.redirect('/allcamp')
})

app.listen(3000,() =>{
    console.log('connected')
})