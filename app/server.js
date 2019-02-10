const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

//allow css and js files to be accessed statically
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

//serve index.html for default requests
app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname}));

//server html files from base directory without extension
app.use(express.static(__dirname,{index:false,extensions:['html']}));

//start express server
app.listen(port, () => console.log(`index.js listening on port ${port}!`));
