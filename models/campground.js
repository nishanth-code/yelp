const mongoose = require('mongoose');

const schema = mongoose.Schema;
const campgroundSchema = new schema({
    title: String,
    image: String,
    price: Number,
    discreption: String,
    location:String

});
module.exports= mongoose.model('campground', campgroundSchema);