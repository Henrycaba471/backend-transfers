const mongoose = require('mongoose');

const connection = async () => {
    try{
        await mongoose.connect('mongodb+srv://transfers:DTu8kHWoZDrbhW2R@cluster0.utycn.mongodb.net/transfers');
        console.log('Connected to Mongo');
    } catch(e){
        throw new Error('Could not connect to Mongo');
    }
}

module.exports = {
    connection
}

//Fre6w3u4y8XfqasF
//DTu8kHWoZDrbhW2R