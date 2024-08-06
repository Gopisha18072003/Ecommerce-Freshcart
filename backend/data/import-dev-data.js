const fs = require('fs');
const mongoose = require('mongoose');
const groceyItems = require('./../models/groceryModel');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB).then(()=> console.log('DB connection successfull!'));

const allItems = JSON.parse(fs.readFileSync(`${__dirname}/appData.json`, 'utf-8'));

const importData = async () => {
    try {
        await groceyItems.create(allItems);
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await groceyItems.deleteMany();
        console.log('Data successfully deleted!');
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] == '--import') {
    importData();
} else if (process.argv[2] == '--delete') {
    deleteData();
}