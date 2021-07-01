const mongoose = require('mongoose');
const Book = require('./book');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    shortDescription: {
        type: String,
    },
    photoImage: {
        type: Buffer,
        required: true
    },
    photoImageType: {
        type: String,
        required: true
    }
})

authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id}, (err, books) => {
        if(err) {
            next(err);
        } else if(books.length > 0) {
            next(new Error('This author has books still'));
        } else {
            next();
        }
    })
});

authorSchema.virtual('photoPath').get(function() {
    if(this.photoImage != null && this.photoImageType != null) {
        return `data: ${this.photoImageType}; charset=utf-8;base64,${this.photoImage.toString('base64')}`
    }
});

module.exports = mongoose.model('Author', authorSchema);