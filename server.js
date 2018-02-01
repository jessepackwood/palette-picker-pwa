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

// the specific port that the server is running on, in this case 3000
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.locals.title = 'Palette Picker';

app.listen(app.get('port'), ()=> {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});

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

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      return response.status(200).json({ palettes })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for ( let requiredParams of ['project_name']) {
    if(!project[requiredParams]) {
      return response.status(422).json({
      error: `You are missing ${requiredParams}`
      })
    }
  }

  database('projects').insert(project, 'id')
  .then(project => {
    return response.status(201).json({ id: project[0] })
  })
  .catch(error => {
    return response.status(500).json({ error })
  })
})



app.post('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;
  const palette = {...request.body.palette, projects_id: id}

  for ( let requiredParams of [
    'project_name', 'palette_name', 'color1', 'color2', 'color3', 'color4', 'color5'
    ]) 
  {
    if(!palette[requiredParams]) {
      return response.status(422).json({
        error: `You are missing ${requiredParams}`
      })
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      return response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

app.delete('/api/v1/palettes/:id', (request, response)=>{ 
  const { id } = request.params;  
  database('palettes').select().then((p) => console.log(p))
  database('palettes').where({ id }).del() 
    .then(palette=>{
      if (palette){ 
        response.sendStatus(204); 
      } else {
        response.status(422).json({ error: `No palette with an id ${id} was found` }); 
      }
    })
    .catch(error=>{ 
      response.status(500).json({ error }); 
    }); 
});

module.exports = app;