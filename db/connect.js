const mongoose = require('mongoose');
async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected')
      } catch (error) {
        console.error('DB connect error ',error)
      }
}

module.exports = {connectDB}