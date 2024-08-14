const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Product = require('./models/groceryModel');

const dotenv = require('dotenv');
dotenv.config({path:'./config.env' });

// AWS Configuration
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
});

// MongoDB connection
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose.connect(DB, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

async function migrateFilesToS3() {
  const products = await Product.find(); // Fetch all products
  
  for (const product of products) {
    const localFilePath = path.join(__dirname, 'uploads/items', product.image);
    const fileContent = fs.readFileSync(localFilePath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/items/${product.image}`, // same as current filename
      Body: fileContent,
      // Removed ACL property
    };

    try {
      const command = new PutObjectCommand(params);
      const uploadResult = await s3.send(command);

      product.image = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      await product.save();

      console.log(`Successfully uploaded ${product.image}`);
    } catch (error) {
      console.error(`Failed to upload ${product.image}:`, error);
    }
  }
}

migrateFilesToS3().then(() => {
    console.log('Migration complete!');
    mongoose.disconnect();
}).catch(error => {
    console.error('Migration failed:', error);
    mongoose.disconnect();
});
