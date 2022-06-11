const express = require('express');
const  mongoose  = require('mongoose');
const app = express();
const cities=require('./cities')
const seedholder = require('./seedhelpers')
const  { descript,places } = require('./seedhelpers')
const path = require('path');
const { deleteMany } = require('../models/campground');
const camp = require('../models/campground');
const campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp',{
useNewUrlParser: true,
useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error',console.error.bind('connection error:'))
db.once("open",() => {
    console.log("db connected")
});
const sample = array => array[Math.floor(Math.random()*array.length)]
const seedb = async() =>{
    await camp.deleteMany({})
    for(let i=0;i<50;i++){
        var rand = Math.floor(Math.random()*1000)
        var pri = Math.floor(Math.random()*30)+10
        const c = new camp({
            location: `${cities[rand].city , cities[rand].state}`,
            title: `${sample(descript)} , ${sample(places)}`,
            price: pri,
            image:'https://source.unsplash.com/collection/483251',
            discreption:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque sequi maiores aliquam iste dolorem explicabo libero quisquam, modi dolore fugiat labore magnam fugit praesentium et debitis dignissimos maxime porro nihil?'
        })
       await c.save()
    }
    const z = campground.find({})
    console.log(z)
}
seedb();