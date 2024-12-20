const mongoose = require('mongoose');

const connection = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/p_transfers'); //process.env.DB_URL_PAY);
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