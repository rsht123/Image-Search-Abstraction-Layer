const express = require('express');
const imageSearch = require('node-google-image-search');
const dotenv = require('dotenv').config();
const app = express();

let searchQueries = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/search/:image', (req, res) => {
    let searchQuery = req.params.image;
    handleSearches(searchQuery);
    let offset = req.query.offset;
    if(offset == 0) offset = 1;
    let results = imageSearch(searchQuery, (data) => {
        let finalJson = trimJSON(data);
        res.send(finalJson);
    }, offset, 10);
})

app.get('/latest', (req, res) => {
    res.json(searchQueries);
})

app.listen(3000, () => {
    console.log('App running on port 3000.');
})

const trimJSON = (data) => {
    let result = [];
    data.forEach((val) => {
        let individual = {
            "Title": val['title'],
            "ImageUrl": val['link'],
            "Thumbnail": val['image']['thumbnailLink'],
            "Context": val['image']['contextLink']
        }
        result.push(individual);
    })
    return result;
}

const handleSearches = (latest) => {
    let newQuery = {
        "Query": latest,
        "Time": new Date()
    }
    searchQueries.unshift(newQuery);
    if(searchQueries.length > 10) {
        searchQueries.pop();
    }
}