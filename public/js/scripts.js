function changeFlag() {
  $(this).toggleClass('selected-flag');
  $(this).parents('.color-box').toggleClass('selected');
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

const appendProjectName = async () => {
  const projectName = $('.project-input').val();
  const project = await postProjectName()
  $('.dropdown').append(`<option data-projectId='${project.id}'>${projectName}</option>`);
  $('.project-input').val('');
}

const postProjectName = async () => {
  const projectName = $('.project-input').val();
  try {
  const postProject = await fetch('/api/v1/projects', {
    method: 'POST', 
    body: JSON.stringify({project_name:  projectName}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const project = await postProject.json()
  return project
  } catch (error) {
  }
}



const savePalette = () => {
  const palette_name = $('.palette-input').val()
  const project_name = $('.dropdown').val()
  const projects_id = $('.dropdown').find(':selected').attr('data-projectId')

  const paletteColors = {
    color1: $('#hex-one').text(),
    color2: $('#hex-two').text(),
    color3: $('#hex-three').text(),
    color4: $('#hex-four').text(),
    color5: $('#hex-five').text()
  }

  const palette = {project_name, palette_name, projects_id, ...paletteColors}
  addNewPalette(palette);
  postPalette(palette);
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
    return project
  } catch (error) {
    error: 'Could not post palette'
  }
}

const deletePalette = async (event) => {
  const paletteElement = $(event.target).closest('.palette')
  const paletteId = paletteElement.data('palette-id')
  try {
  const deletePalette = await fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  paletteElement.remove()
  } catch (error) {
    console.log(error)
  }
} 

const fetchProjects = async () => {
  const unresolvedProjects = await fetch('/api/v1/projects')
  const fetchedProjects = await unresolvedProjects.json()
  const projects = fetchedProjects.projects
  projects.forEach( project => {
    $('.dropdown').append(`<option data-projectId=${project.id} >${project.project_name}</option>`)
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
    newProjectObj[currProject.project_name].push(currProject)
    return newProjectObj
  }, {})
  console.log(allProjects)
  mapPalettes(allProjects)
}

const addNewPalette = (newPalette) => {
  if (!globalProjects[newPalette.project_name]) {
    Object.assign(globalProjects, {[newPalette.project_name]: []})
  }
  globalProjects[newPalette.project_name].push(newPalette);
  $('.project-container').empty()
  mapPalettes(globalProjects)
}

let globalProjects;


function mapPalettes(allProjects) {
  globalProjects = allProjects
  const projectName = Object.keys(allProjects)
  projectName.map(key => {
    appendProjectCard(allProjects[key][0]);
    allProjects[key].map( (palette, index) => {
      appendPalette(palette, index);
    })
  })
}

function appendProjectCard(palette, index) {
  const { project_name, palette_name} = palette
  $('.project-container').append(
    `<div class='appended-project' data-project-name=${project_name}>
      <h3 class='append-project-title'><span class='append-project-subtitle'>Title: </span>${project_name}</h3>
     </div>`
  )
}

const appendPalette = (palette) => {
  const { project_name, palette_name, id, color1, color2, color3, color4, color5} = palette

  const hashedPaletteName = palette_name

  $(`.appended-project[data-project-name="${project_name}"]`).append(`
      <div class='palette' data-palette-id='${id}'>
        <h4 class='append-palette-title'><span class='append-project-subtitle'>Palette: </span> ${palette_name}</h4>
        <div class='appended-palettes-container' >
          <div class='append-hex' style="background-color: ${color1}">${color1}</div>
          <div class='append-hex' style="background-color: ${color2}">${color2}</div>
          <div class='append-hex' style="background-color: ${color3}">${color3}</div>
          <div class='append-hex' style="background-color: ${color4}">${color4}</div>
          <div class='append-hex' style="background-color: ${color5}">${color5}</div>
          <button class='btn-palette-delete'>Delete</button>
        </div>
      </div>
  `)

  $('.palette-input').val('');
  $('.dropdown').val('Project Title');
}


$(document).on('keyup', function(event){
    if(event.keyCode == 32 && !$(event.target).hasClass('ignore-space')){
      setColors()
    }
})

$('.lock-icon').on('click', changeFlag);
$('.btn-add').on('click', appendProjectName);
$('.btn-save').on('click', savePalette);
$('.btn-new-flavors').on('click', setColors);
$(document).on('click', '.btn-palette-delete', deletePalette);


$(document).ready(() => {
  setColors();
  fetchProjects();
  fetchPalettes();
})

