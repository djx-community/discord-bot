const mongoose = require('mongoose')
const {mongo_uri} = require('../../config.json')

const connectDb = async () => {
    const connection = await mongoose.connect(mongo_uri)
    switch(connection.connection.readyState){
        case 0: console.log(`Connection to database failed`); break
        case 1: console.log(`Connection to databse successful`); break
        case 2: console.log('Server is trying to connect to database'); break
        case 3: console.log('Disconnecting from database'); break
    }
    return connection
}

module.exports={connectDb}
