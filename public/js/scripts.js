//need event jquery listeners

//need to create random colors on page load

//each color box have an id?

$('.lock-icon').on('click', changeFlag)
$('#new-palette').on('click', setColors)

function changeFlag() {
  console.log('click')
  $(this).toggleClass('selected-flag')
}

function getRandomColor() {
  var hexCode = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += hexCode[Math.floor(Math.random() * 16)];
  }
  console.log(color)
  return color;
}

function setColors() {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  const color3 = getRandomColor();
  const color4 = getRandomColor();
  const color5 = getRandomColor();

  $('#color-one').css('background', color1)
  $('#color-two').css('background', color2)
  $('#color-three').css('background', color3)
  $('#color-four').css('background', color4)
  $('#color-five').css('background', color5)
}

$(document).ready(setColors)