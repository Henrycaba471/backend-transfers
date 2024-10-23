const mongoose = require('mongoose');

const connection = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/transfers');
        console.log('Connected to Mongo');
    } catch(e){
        throw new Error('Could not connect to Mongo');
    }
}

module.exports = {
    connection
}

//Fre6w3u4y8XfqasF