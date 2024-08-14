const { S3Client } = require('@aws-sdk/client-s3'); // Import S3Client from v3 SDK
const multer = require('multer'); // Only one import of multer is needed
const multerS3 = require('multer-s3');
const { v1: uuidv1 } = require('uuid'); // Import uuidv1 from uuid

// AWS Configuration
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION // e.g., 'us-west-1'
});

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};

// Multer configuration with S3
const fileUpload = multer({
    limits: { fileSize: 500000 }, // 500 KB limit
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, `uploads/images/${uuidv1()}.${ext}`); // S3 key (file path)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid MIME Type');
        cb(error, isValid);
    }
});

module.exports = fileUpload;
