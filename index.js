function showSearchLinks() {
    const query = document.getElementById('campo-busca').value.trim();
    if (query !== "") {
        document.getElementById('div-links').style.display = 'block';
    }
}

function hideSearchLinks() {
    setTimeout(() => {
        document.getElementById('div-links').style.display = 'none';
    }, 300);
}

const searchInput = document.getElementById('campo-busca');
if (searchInput) {
    searchInput.addEventListener('focus', showSearchLinks);
    searchInput.addEventListener('blur', hideSearchLinks);
}

function buscar() {
    const query = document.getElementById('campo-busca').value.trim();
    if (query !== "") {
        document.getElementById('div-links').style.display = 'block';
    }
}

function initCalendar() {
    const today = new Date();
    const calendarDisplay = document.getElementById('mostrar-calendario');

    if (calendarDisplay) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = weekdays[today.getDay()];
        const dayNumber = today.getDate();
        const monthName = months[today.getMonth()];
        const currentYear = today.getFullYear();
        
        calendarDisplay.innerText = `${dayName}, ${monthName} ${dayNumber}, ${currentYear}`;
    }
}

let stopwatchInterval;
let elapsedTime = 0;

function updateStopwatchDisplay() {
    const totalSeconds = Math.floor(elapsedTime / 1000);

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById('tempo').innerText = `${hours}:${minutes}:${seconds}`;
}

function iniciar() {
    if (stopwatchInterval) return;

    const startTime = Date.now() - elapsedTime;

    stopwatchInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 100);
}

function parar() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function limpar() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = 0;
    updateStopwatchDisplay();
}

function salvarNotas() {
    const noteText = document.getElementById('texto-notas').value;
    localStorage.setItem('userNotes', noteText);
}

function loadNotes() {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
        document.getElementById('texto-notas').value = savedNotes;
    }
}

let isGameRunning = false;
let obstacleTimeout;
let obstacleInterval;
let currentScore = 0;
let isJumping = false;
let playerHeight = 3;

function alternarJogo() {
    const gameScreen = document.getElementById('tela-do-jogo');

    if (gameScreen.style.display === 'block') {
        gameScreen.style.display = 'none';
        stopGame();
    } else {
        gameScreen.style.display = 'block';
        startGame();
    }
}

function startGame() {
    isGameRunning = true;
    currentScore = 0;
    isJumping = false;
    playerHeight = 3;

    document.getElementById('pontos').innerText = "Score: " + currentScore;

    const activeObstacles = document.querySelectorAll('.obstacle');
    activeObstacles.forEach(obstacle => obstacle.remove());

    const player = document.getElementById('boneco');
    if (player) {
        player.style.bottom = "3px";
    }

    clearTimeout(obstacleTimeout);
    clearInterval(obstacleInterval);

    spawnObstacle();
}

function stopGame() {
    isGameRunning = false;
    clearTimeout(obstacleTimeout);
    clearInterval(obstacleInterval);
}

function handleJump() {
    if (!isGameRunning || isJumping) return;

    isJumping = true;
    const player = document.getElementById('boneco');
    playerHeight = 3;

    const jumpUp = setInterval(() => {
        if (playerHeight >= 58) {
            clearInterval(jumpUp);

            const fallDown = setInterval(() => {
                playerHeight -= 3;

                if (playerHeight <= 3) {
                    playerHeight = 3;
                    clearInterval(fallDown);
                    isJumping = false;
                }
                player.style.bottom = playerHeight + 'px';
            }, 15);

        } else {
            playerHeight += 4;
            player.style.bottom = playerHeight + 'px';
        }
    }, 15);
}

function spawnObstacle() {
    if (!isGameRunning) return;

    const gameContainer = document.getElementById('tela-do-jogo');
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameContainer.appendChild(obstacle);

    let obstaclePositionX = 180;

    obstacleInterval = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(obstacleInterval);
            obstacle.remove();
            return;
        }

        obstaclePositionX -= 3;
        obstacle.style.left = obstaclePositionX + 'px';

        if (obstaclePositionX > 5 && obstaclePositionX < 25 && playerHeight < 20) {
            stopGame();
            obstacle.remove();
            setTimeout(() => {
                alert("Game Over! Your score was: " + currentScore);
            }, 10);
            return;
        }

        if (obstaclePositionX < -20) {
            clearInterval(obstacleInterval);
            obstacle.remove();
            currentScore += 1;
            document.getElementById('pontos').innerText = "Score: " + currentScore;
        }
    }, 20);

    const randomSpawnDelay = Math.random() * 2000 + 1500;
    obstacleTimeout = setTimeout(spawnObstacle, randomSpawnDelay);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isGameRunning) {
            event.preventDefault();
        }
        handleJump();
    }
});

document.getElementById('tela-do-jogo').addEventListener('click', handleJump);

function initApp() {
    initCalendar();
    loadNotes();
    updateStopwatchDisplay();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

let blocoSelecionado = null;

const todosOsBlocos = document.querySelectorAll('.arrastavel');
todosOsBlocos.forEach(bloco => {
    const cabecalho = bloco.querySelector('h3');
    if (cabecalho) {
        cabecalho.addEventListener('mousedown', () => {
            blocoSelecionado = bloco;
            bloco.style.position = 'fixed';
            bloco.style.zIndex = '1000';
            bloco.style.margin = '0';
        });
    }
});

document.addEventListener('mousemove', (e) => {
    if (blocoSelecionado) {
        blocoSelecionado.style.left = e.clientX + 'px';
        blocoSelecionado.style.top = e.clientY + 'px';
    }
});

document.addEventListener('mouseup', () => {
    blocoSelecionado = null;
});