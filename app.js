let players = [];
let currentPlayerIndex = 0;
let gameState = { words: [], letter: '', timeLeft: 60 };


// funcion para escoger el numero de Playeres y el nombre de Playeres
function setPlayers(count) {
    document.querySelector('.welcome-screen').style.display = 'none';
    document.querySelector('.players-setup').style.display = 'block';
    
    const inputsContainer = document.getElementById('player-inputs');
    inputsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1}`;
        inputsContainer.appendChild(input);
    }
}

// funcion para que empiece el juego
function startGame() {
    players = Array.from(document.querySelectorAll('.players-setup input')).map(input => ({
        name: input.value || `Player ${players.length + 1}`,
        points: 0,
        words: []
    }));
    
    document.querySelector('.players-setup').style.display = 'none';
    showPrepareScreen();
}

//mostrar la letra con la cual se va a empezar las palabras

function showPrepareScreen() {
    const player = players[currentPlayerIndex];
    const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    player.letter = letters[Math.floor(Math.random() * letters.length)];

    gameState = { words: [], letter: player.letter, timeLeft: 20 };

    document.querySelector('.word-list').innerHTML = ''; 
    document.querySelector('.prepare-screen').style.display = 'block';
    document.querySelector('.prepare-message').textContent = `¡${player.name}, es tu turno!`;
    document.querySelector('.letter-display').textContent = player.letter;
}


// funcion para que empiece el juego 

function startPlayerTimer() {
    document.querySelector('.prepare-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'block';
    
    const player = players[currentPlayerIndex];
    document.querySelector('.current-player').textContent = `Turno de: ${player.name}`;
    

    const wordInput = document.getElementById('word-input');
    wordInput.placeholder = `word with the letter "${gameState.letter}"`;
    
    startTimer();
}

// funcion para que empiece el tiempo 
function startTimer() {
    const timer = document.querySelector('.timer');
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        timer.textContent = `${gameState.timeLeft}s`;
        
        if (gameState.timeLeft <= 0) endPlayerTurn();
    }, 1000);
}

// funcion que para que cuando de enter se ponga la palabra
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        const wordInput = document.getElementById('word-input');
        const word = wordInput.value.trim().toUpperCase();
        
        if (isValidWord(word)) {
            addWord(word);
            wordInput.value = '';
        }
    }
}


 // funcion para que la palabra sea valida y si empieza por la letra que se recomendo 
function isValidWord(word) {
    return word && word.startsWith(gameState.letter) && /^[A-ZÑ]+$/.test(word) && !gameState.words.includes(word);
}


// funcion para que la palabra quede en el recuadro de las palabras
function addWord(word) {
    gameState.words.push(word);
    document.querySelector('.word-list').innerHTML += `<div>${word}</div>`;
}


 // funcion que la palabra no sea solo una letra
function isValidWord(word) {
    return word && word.length > 1 && word.startsWith(gameState.letter) 
           && /^[A-ZÑ]+$/.test(word) && !gameState.words.includes(word);
}


// funcion cuando se acabe el tiempo y se guarde los resultados, y siga el siguente Player
function endPlayerTurn() {
    clearInterval(gameState.timerInterval);
    
    players[currentPlayerIndex].words = [...gameState.words];
    players[currentPlayerIndex].points = gameState.words.length;
    
    currentPlayerIndex++;
    
    if (currentPlayerIndex < players.length) {
        showPrepareScreen();
    } else {
        showResults();
    }
}


// funcion para mostrar los resultados 

function showResults() {
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';
    
    players.sort((a, b) => b.points - a.points);
    
    players.forEach(player => {
        tbody.innerHTML += `
            <tr>
                <td>${player.name}</td>
                <td>${player.letter}</td>
                <td>${player.words.join(', ')}</td>
                <td>${player.points}</td>
            </tr>
        `;
    });
    
    document.querySelector('.results-screen').style.display = 'block';
}


//funcion para que se repita el juego 
function resetGame() {
    currentPlayerIndex = 0;
    players = [];
    gameState = { words: [], letter: '', timeLeft: 60 };
    
    document.querySelector('.results-screen').style.display = 'none';
    document.querySelector('.welcome-screen').style.display = 'block';
}
