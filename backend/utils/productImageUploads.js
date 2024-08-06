const multer = require('multer');
const uuid = require('uuid')
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',

}
const productFileUpload = multer({
    limits: { fileSize: 500000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/items')
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid.v1() + '.' + ext);

        }
    }),
    fileFilter : (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid MIME Type');
        cb(error, isValid)
    }
})

module.exports = productFileUpload