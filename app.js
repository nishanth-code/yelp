const express = require('express');
const  mongoose  = require('mongoose');
const app = express();
const Joi = require('joi')
const { campvalidation } = require('./schemavalidations')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const camp = require('./models/campground');
const AsyncHandler = require('./error_handlers/asyncerror-handler')
const { findByIdAndDelete, schema } = require('./models/campground');
const ExpressError = require('./error_handlers/expresserror');
const { title } = require('process');
mongoose.connect('mongodb+srv://nishanth:nish1234@cluster0.bbodeek.mongodb.net/yelpCamps',{
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
const schemaValidator = (req,res,next) =>
{
    
   
    const { error } = campvalidation.validate({})
    if(error)
    {
        const msg = error.detail.map(el => el.message).join(' ')
        throw new ExpressError(msg,400)
    } else
     next();
}
app.get('/allcamp', async (req,res) =>{
    const campground = await camp.find({})
    res.render('campground/index' , { campground })
})
app.get('/add_camp', (req,res) => {
    res.render('campground/create')
})
app.post('/add',schemaValidator,AsyncHandler(async (req,res,next) =>{
    const c= new camp(req.body.campground)
    
    await c.save()
    res.redirect('/allcamp')
    

}))
app.get('/allcamp/:id', AsyncHandler(async(req,res,next) =>{
    const c = await camp.findById(req.params.id)
    res.render('campground/show', { c })
}))
app.get('/allcamp/:id/edit', AsyncHandler(async(req,res,next) => {
    const c = await camp.findById(req.params.id)
    res.render('campground/edit', { c })

}))
app.put('/allcamp/:id' ,schemaValidator, AsyncHandler(async(req,res,next) => {
    const campgrnd = await camp.findByIdAndUpdate(req.params.id,{...req.body.campground})
    res.redirect(`/allcamp/${req.params.id}`)
}))
app.delete('/allcamp/:id/delete', async(req,res) =>{
    await camp.findByIdAndDelete(req.params.id)
    res.redirect('/allcamp')
})
app.all('*',(req,res,next) =>{
    next(new ExpressError('page not found',404));
})
app.use((err,req,res,next) =>{
    const { statusCode = 500}=err;
    if(!err.message){
        err.message="oh no!, something went wrong"
    }
    res.status(statusCode).render('campground/error',{ err });
    

})


app.listen(3000,() =>{
    console.log('connected')
})