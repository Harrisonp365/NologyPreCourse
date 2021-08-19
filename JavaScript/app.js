document.addEventListener('DOMContentLoaded' , () => {
  const bird = document.querySelector('.bird')
  const DisplayScreen = document.querySelector('.game-container')
  const ground = document.querySelector('.ground')

  let birdLeft = 220
  let birdBottom = 100
  let birdDrop = 2 // bird will drop 2px every 20ms

  function startGame() {
    birdBottom -= birdDrop
    bird.style.bottom = birdBottom + 'px'
    bird.style.left = birdLeft + 'px'
  }

  let limer = setInterval(startGame, 20)

  function jump() {
    birdBottom += 50 //Each jump is 50px above current position
    bird.style.bottom = birdBottom + 'px'
  }
  document.addEventListener('keyup', jump) // can use any key on keyboard
})