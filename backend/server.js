const app = require('./app');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path:'./config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB,{ serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000,}).then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 8001

const server = app.listen(port, () => {
    console.log(`Server Listening at port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err)
    console.log("Shutting the server down");
    server.close(() => {
        process.exit();
    })
})