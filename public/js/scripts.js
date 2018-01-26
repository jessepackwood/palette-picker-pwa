// import { postProjectName } from './helper.js'

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      setColors()
    }
}

function changeFlag() {
  $(this).toggleClass('selected-flag')
  $(this).parents('.color-box').toggleClass('selected')
}

function getRandomColor() {
  var hexCode = '0123456789ABCDEF';
  var color = '#';
  var brightness = 0;
  for (var i = 0; i < 6; i++) {
    const singleChar = [Math.floor(Math.random() * 16)]
    color += hexCode[singleChar];
    if (i === 0 || i === 2 || i === 4) {
      brightness += parseInt(singleChar)
    }
  }

  brightness < 20 ? brightness = 0 : brightness = 1;
  return [ color, brightness ];
}

function setColors() {
  const boxes = $('.color-box')
  boxes.each( function() {
    const brightnessArray = [ '#fff', '#000'];
    if (!$(this).hasClass('selected')) {
    let color = getRandomColor()
    $(this).css('background', color[0]);
    $(this).find('.hex-code').text(color[0]).css('color', brightnessArray[color[1]])
    }
  })
}

const appendProjectName = () => {
  const projectName = $('.project-input').val();
  $('.dropdown').append(`<option>${projectName}</option>`);
  $('.project-input').val('');
  postProjectName(projectName);
}

const postProjectName = async (projectName) => {
  try {
  const postProject = await fetch('/api/v1/projects', {
    method: 'POST', 
    body: JSON.stringify({project_name:  projectName}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const project = await postProject.json()
    console.log(project)
    return project
  } catch (error) {
  }
}

const savePalette = () => {
  const palette_name = $('.palette-input').val()
  const project_name = $('.dropdown').val()
  const projects_id = $('#appended-project').attr('projectId')

  const paletteColors = {
    color1: $('#hex-one').text(),
    color2: $('#hex-two').text(),
    color3: $('#hex-three').text(),
    color4: $('#hex-four').text(),
    color5: $('#hex-five').text()
  }
  
  const palette = {project_name, palette_name, projects_id, ...paletteColors}
  postPalette(palette)
}

const postPalette = async (palette) => {
  console.log(palette)
  try {
  const postPalette = await fetch(`/api/v1/projects/${palette.projects_id}/palettes`, {
    method: 'POST', 
    body: JSON.stringify({ palette }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const paletteData = await postPalette.json()
    console.log(paletteData)
    return project
  } catch (error) {
    error: 'Could not post palette'
  }
} 

const fetchProjects = async () => {
  const unresolvedProjects = await fetch('/api/v1/projects')
  const fetchedProjects = await unresolvedProjects.json()
  const projects = fetchedProjects.projects
  projects.forEach( name => {
    $('.dropdown').append(`<option >${name.project_name}</option>`)
  })
}

const fetchPalettes = async () => {
  const unresolvedPalettes = await fetch('/api/v1/palettes')
  const fetchedPalettes = await unresolvedPalettes.json()
  const palettes = fetchedPalettes.palettes
  structureProjects(palettes)
}

const structureProjects = (palettes) => {
  const allProjects = palettes.reduce( (newProjectObj, currProject) => {
    if (!newProjectObj[currProject.project_name]) {
      Object.assign(newProjectObj, {[currProject.project_name]: []})
    }
    else {
      newProjectObj[currProject.project_name].push(currProject)
    }
    return newProjectObj
  }, {})
  mapPalettes(allProjects)
}


function mapPalettes(allProjects) {
  const projectName = Object.keys(allProjects)
  projectName.map(key => {
    allProjects[key].map( palette => {
      appendProjectCard(palette)
    })
  })
}

function appendProjectCard(palette) {
  const { project_name, palette_name, id, color1, color2, color3, color4, color5} = palette
  $('.project-container').append(
    `<div id='appended-project' projectId=${palette.projects_id} paletteId=${id}>
      <h3>${project_name}</h3>
      <h4>${palette_name}</h4>
      <div>${color1}</div>
      <div>${color2}</div>
      <div>${color3}</div>
      <div>${color4}</div>
      <div>${color5}</div>
    </div>`
  )
}



$('.lock-icon').on('click', changeFlag)
$('#new-palette').on('click', setColors)
$('.btn-add').on('click', appendProjectName)
$('.btn-save').on('click', savePalette)

$(document).ready(() => {
  setColors();
  fetchProjects();
  fetchPalettes();
})

