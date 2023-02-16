const mongoose = require('mongoose');
const camps = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/camp')

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/CampGrounds')
    .then(() => {
        console.log("Server opened!!");
    })
    .catch((err) => {
        console.log(err);
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connecton error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => {
    const arr = array[Math.floor(Math.random() * array.length)]
    return arr;
}
const seedDB = async () => {

    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${camps[rand1000].city},${camps[rand1000].state}`,
            price, 
            image:"https://source.unsplash.com/collection/483251",
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident voluptatem soluta quae perferendis blanditiis mollitia consequuntur. Voluptas cum atque rem a, suscipit aspernatur libero quis sed, ipsum error assumenda velit."

        })

        await camp.save();
    }
}

seedDB();