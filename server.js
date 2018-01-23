//requiring the express library/framework
const express = require('express');
// creating a new instance of an express app
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Palette Picker');
});

app.listen(app.get('port'), ()=> {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});