const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successfull!'));

const port = process.env.port || 8001

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