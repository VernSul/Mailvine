const express = require('express');

const formater = require('./controllers/formattingController');
const template = require('./controllers/templateController')

const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/upload', formater.format);
app.post('/test', formater.test);
app.post('/single', formater.single);

app.post('/recordtemplate', template.recordTemplate);
app.get('/gettemplate', template.get)
app.post('/deletetemplate', template.delete);
app.post('/updatetemplate', template.update)

app.listen(PORT, () => console.log('Listen on port 4000'))