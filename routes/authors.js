const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const imageMimeTypes = ['image/jpeg', 'image/jpg','image/png', 'image/gif'];

//All authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name), 'i';
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });   
    } catch {
        res.redirect('/')
    }
});

//New authors route
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() });
})

//Create authors route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        shortDescription: shortDesc(req.body.description, 20)
    });
    
    saveCover(author, req.body.photo)
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch {
        res.render('authors/new', { 
            author: author,
            errorMessage : `Error creating author` 
        })
    }
});

//Show author route
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const book = await Book.find( {author: author.id} ).limit(10).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: book
        });
    } catch {
        res.redirect('/')
    }
});
//Edit author route
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });  
    } catch {
        res.redirect('/authors');
    }
});

//Update author route
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id);

        author.name = req.body.name;
        author.title = req.body.title;
        author.description = req.body.description;
        author.shortDescription = shortDesc(req.body.description, 20)

        if(req.body.photo != null && req.body.photo !== '') {
            saveCover(author, req.body.photo)
        }
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch {
        if(author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', { 
                author: author,
                errorMessage : `Error edit author` 
            })
        }
    }
});

//Delete author route
router.delete('/:id', async (req, res) => {
    let author;

    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch {
        if(author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
});

function saveCover(author, photoEncoded) {
    if(photoEncoded == null) return
    const photo = JSON.parse(photoEncoded);
    if(photo != null && imageMimeTypes.includes(photo.type)) {
        author.photoImage = new Buffer.from(photo.data, 'base64');
        author.photoImageType = photo.type
    }
}

function shortDesc (str, limit) {
    let strArr = str.split(' ');
    let shortStr = '';
    for(let i = 0; i < limit; i++) {
        i < limit - 1 ? shortStr += strArr[i] + " " : shortStr += strArr[i]
    }   
    return shortStr + '...'
}

module.exports = router;