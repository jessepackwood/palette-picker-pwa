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
  console.log('fired')
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
  const projects_id = $('.dropdown').find(':selected').attr('data-projectId')

  const paletteColors = {
    color1: $('#hex-one').text(),
    color2: $('#hex-two').text(),
    color3: $('#hex-three').text(),
    color4: $('#hex-four').text(),
    color5: $('#hex-five').text()
  }

  const palette = {project_name, palette_name, projects_id, ...paletteColors}
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
    allProjects[key].map( (palette, index) => {
      appendProjectCard(palette, index)
    })
  })
}

function appendProjectCard(palette, index) {
  const { project_name, palette_name, id, color1, color2, color3, color4, color5} = palette
  $('.project-container').append(
    `<div class='appended-project' paletteId=${id}>
      <h3 class='append-project-title'><span class='append-project-subtitle'>Title: </span>${project_name}</h3>
      <h4 class='append-palette-title'><span class='append-project-subtitle'>Palette: </span> ${palette_name}</h4>
      <div class='appended-palettes-container'>
        <div id='${palette_name}-${index}-1' class='append-hex'>${color1}</div>
        <div id='${palette_name}-${index}-2' class='append-hex'>${color2}</div>
        <div id='${palette_name}-${index}-3' class='append-hex'>${color3}</div>
        <div id='${palette_name}-${index}-4' class='append-hex'>${color4}</div>
        <div id='${palette_name}-${index}-5' class='append-hex'>${color5}</div>
      </div>
    </div>`
  )
  $(`#${palette_name}-${index}-1`).css('background-color', color1)
  $(`#${palette_name}-${index}-2`).css('background-color', color2)
  $(`#${palette_name}-${index}-3`).css('background-color', color3)
  $(`#${palette_name}-${index}-4`).css('background-color', color4)
  $(`#${palette_name}-${index}-5`).css('background-color', color5)
}

const appendPalette = () => {
  const palette_name = $('.palette-input').val();
  const project_name = $('.dropdown').val();
  const color1 = $('#hex-one').text();
  const color2 = $('#hex-two').text();
  const color3 = $('#hex-three').text();
  const color4 = $('#hex-four').text();
  const color5 = $('#hex-five').text();
  $('.project-container').append(`
    <div class='appended-project'>
      <h3 class='append-project-title'><span class='append-project-subtitle'>Title: </span>${project_name}</h3>
      <div>
        <h4 class='append-palette-title'><span class='append-project-subtitle'>Palette: </span> ${palette_name}</h4>
        <div class='appended-palettes-container'>
          <div id='${palette_name}-1' class='append-hex'>${color1}</div>
          <div id='${palette_name}-2' class='append-hex'>${color2}</div>
          <div id='${palette_name}-3' class='append-hex'>${color3}</div>
          <div id='${palette_name}-4' class='append-hex'>${color4}</div>
          <div id='${palette_name}-5' class='append-hex'>${color5}</div>
        </div>
      </div>
    </div>
  `)

  $(`#${palette_name}-1`).css('background-color', color1);
  $(`#${palette_name}-2`).css('background-color', color2);
  $(`#${palette_name}-3`).css('background-color', color3);
  $(`#${palette_name}-4`).css('background-color', color4);
  $(`#${palette_name}-5`).css('background-color', color5);
  $('.palette-input').val('');
  $('.dropdown').val('Project Title');
}



$('.lock-icon').on('click', changeFlag);
$('.btn-add').on('click', appendProjectName);
$('.btn-save').on('click', savePalette);
$('.btn-save').on('click', appendPalette);
$('.btn-new-flavors').on('click', setColors);

$(document).ready(() => {
  setColors();
  fetchProjects();
  fetchPalettes();
})

