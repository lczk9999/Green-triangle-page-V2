// --- 1. SISTEMA DE BUSCA ---
function toggleLinks() {
    const container = document.getElementById('links-container');
    // fiz esse if pra abrir e fechar a lista de links
    if (container.style.display === 'flex') {
        container.style.display = 'none';
    } else {
        container.style.display = 'flex';
    }
}

// --- 2. LOGICA DO CRONOMETRO ---
let relogio;
let tempo = 0;

function updateStopwatchDisplay() {
    let totalSegundos = Math.floor(tempo / 1000);
    let horas = Math.floor(totalSegundos / 3600);
    let minutos = Math.floor((totalSegundos % 3600) / 60);
    let segundos = totalSegundos % 60;
    
    // Aluno usa IF normal em vez de ternario complexo
    if (horas < 10) { horas = "0" + horas; }
    if (minutos < 10) { minutes = "0" + minutos; } // typo proposital comum em variavel misturada
    if (segundos < 10) { segundos = "0" + segundos; }

    let displayStr = horas + ":" + minutos + ":" + segundos;
    document.getElementById('stopwatch-display').innerText = displayStr;
}

function startStopwatch() {
    clearInterval(relogio);
    let startTime = Date.now() - tempo;
    relogio = setInterval(() => {
        tempo = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 100);
}

function stopStopwatch() {
    clearInterval(relogio);
}

// --- 3. CALENDARIO AUTOMATICO ----
function loadCalendar() {
    // peguei esse codigo da internet pra formatar a data
    const options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
    const today = new Date();
    document.getElementById('calendar-display').innerText = today.toLocaleDateString('en-US', options);
}
loadCalendar();

// --- 4. JOGO DO TRIANGULO ---
let gameActive = false;
let obstacleTimeout;
let score = 0;
let isJumping = false;

function toggleGame() {
    const gameBox = document.getElementById('game-container');
    if (gameBox.style.display === 'block') {
        gameBox.style.display = 'none';
        stopGame();
    } else {
        gameBox.style.display = 'block';
        startGame();
    }
}

function startGame() {
    gameActive = true;
    score = 0;
    document.getElementById('game-score').innerText = "Score: " + score;

    // limpa os blocos vermelhos antigos da tela
    const oldObstacles = document.querySelectorAll('.obstacle');
    oldObstacles.forEach(obs => obs.remove());

    const player = document.getElementById('player-triangle');
    player.style.bottom = "0px";

    clearTimeout(obstacleTimeout);
    spawnObstacle();
}

function stopGame() {
    gameActive = false;
    clearTimeout(obstacleTimeout);
}

function jump() {
    if (!gameActive || isJumping) return;
    isJumping = true;
    const player = document.getElementById('player-triangle');

    let position = 0;

    // subida do boneco
    let upInterval = setInterval(() => {
        if (position >= 55) {
            clearInterval(upInterval);

            // descida do boneco
            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                position -= 3;
                player.style.bottom = position + 'px';
            }, 15);
        }
        position += 4;
        player.style.bottom = position + 'px';
    }, 15);
}

function spawnObstacle() {
    if (!gameActive) return;

    const container = document.getElementById('game-container');
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    container.appendChild(obstacle);

    let obstaclePos = 220;

    // mexer o obstaculo na tela
    function moveObstacle() {
        if (!gameActive) {
            obstacle.remove();
            return;
        }
        obstaclePos -= 3;
        obstacle.style.left = obstaclePos + 'px';

        const player = document.getElementById('player-triangle');
        let playerBottom = parseInt(player.style.bottom) || 0;

        // checar se bateu (colisao)
        if (obstaclePos > 20 && obstaclePos < 40 && playerBottom < 15) {
            gameActive = false; 
            clearTimeout(obstacleTimeout);
            alert("Game Over! Your Score: " + score);
            startGame();
            return;
        }
        
        if (obstaclePos < -15) {
            obstacle.remove();
            score++;
            document.getElementById('game-score').innerText = "Score: " + score;
        } else {
            requestAnimationFrame(moveObstacle);
        }
    }
    requestAnimationFrame(moveObstacle);

    // sorteia um tempo aleatorio pro proximo vir
    let randomTime = Math.random() * 2000 + 1500;
    obstacleTimeout = setTimeout(spawnObstacle, randomTime);
}