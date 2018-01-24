//requiring the express library/framework
const express = require('express');
// creating a new instance of an express app
const app = express();
const bodyParser = require('body-parser');
//environment variable that tells us what environment our code is running in
const environment = process.env.NODE_ENV || 'development';
//uses environment as the key of the knexfile object
const configuration = require('./knexfile')[environment];
//require knex returns a function that we call immediately, passing in configuration as an argument
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('palettepicker');
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json({ projects })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

app.listen(app.get('port'), ()=> {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});

