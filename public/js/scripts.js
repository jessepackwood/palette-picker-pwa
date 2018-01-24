$('.lock-icon').on('click', changeFlag)
$('#new-palette').on('click', setColors)

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
  console.log(brightness)

  brightness < 20 ? brightness = 0 : brightness = 1;
  console.log(brightness)
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

$(document).ready(setColors)

