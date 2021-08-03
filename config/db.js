const mongoose = require('mongoose');

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    }).catch(err => {
        console.log(`[-] Failed to connect with MONGO DB ${process.env.MONGO_URI}`)
        console.log(err)
        process.exit(1)
    });

    console.log(`[+] MONGO DB connected to ${process.env.MONGO_URI}`);
}

module.exports = connectDb;