const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const militaryImg = ['img/militaryMode/nave-1.png', 'img/militaryMode/nave-2.png', 'img/militaryMode/nave-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const changeTheme = document.querySelector('.change-theme');
let mode = true;
var score = 0;

var sound = new Audio();
var sound2 = new Audio;

let alienInterval;

//movimento e tiro da nave
function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 30;
        yourShip.style.top = `${position}px`;
    }
}

//função de descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "510px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 30;
        yourShip.style.top = `${position}px`;
    }
}

//funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    sound.play();
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    if (mode == true) {
        newLaser.src = 'img/shoot.png';
    } else {
        newLaser.src = 'img/militaryMode/bullet.png';
    }
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if (checkLaserCollision(laser, alien)) {
                if (mode == true) {
                    alien.src = 'img/explosion.png';
                    sound2.src = 'img/short-explosion.wav';
                    sound2.play();
                } else {
                    alien.src = 'img/militaryMode/explosion.png';
                    sound2.src = 'img/militaryMode/fast-explosion.wav';
                    sound2.play();
                }
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    if (mode == true) {
        alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    } else {
        alienSprite = militaryImg[Math.floor(Math.random() * militaryImg.length)]; //sorteio dos militares inimigos
    }
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (xPosition <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            score++;
            return true;

        } else {
            return false;
        }
    } else {
        return false;
    }
}

//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    changeTheme.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert(`GAME OVER! \n Your score was: ${score}.`);
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        changeTheme.style.display = "block";
        instructionsText.style.display = "block";
        mode = true;
        score = 0;
    });
}

changeTheme.addEventListener('click', (event) => {
    exchangeTheme();
})


function exchangeTheme() {
    if (mode == true) {
        mode = false;
        yourShip.src = "img/militaryMode/hero.png"
        sound.src = 'img/militaryMode/shoot.mp3';
        playArea.style.backgroundImage = 'url(img/militaryMode/scene.png)';
        document.body.style.backgroundColor = 'chocolate';


    } else {
        mode = true;
        yourShip.src = "img/hero.png"
        sound.src = 'img/lasershoot.mp3';
        playArea.style.backgroundImage = 'url(img/space.png)';
        document.body.style.backgroundColor = 'cornflowerblue';
    }

}