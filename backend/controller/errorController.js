const fs = require('fs')
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    console.log(err);
    if(req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        })
    }
    if(err.name == 'CastError'){
        res.status(404).json({
            status: 'fail',
            message: 'Invaild product Id'
        });
        return;
    } else if(err.name == 'MongoServerError') {
        res.status(400).json({
            status: 'fail',
            message: 'Product is already present'
        });
        return
    } else if(err.name == 'ValidationError') {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: 'Invaild input data'
        });
        return;
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}