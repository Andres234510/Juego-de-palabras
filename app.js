let players = [];
        let currentPlayerIndex = 0;
        let gameState = {
            words: [],
            letter: '',
            timeLeft: 60,
            timerInterval: null
        };

        function setPlayers(count) {
            document.querySelector('.welcome-screen').style.display = 'none';
            document.querySelector('.players-setup').style.display = 'block';
            
            const inputsContainer = document.getElementById('player-inputs');
            inputsContainer.innerHTML = '';
            
            for (let i = 0; i < count; i++) {
                const div = document.createElement('div');
                div.className = 'player-input';
                div.innerHTML = `
                    <input type="text" placeholder="Nombre del Jugador ${i + 1}" 
                           id="player${i}" required>
                `;
                inputsContainer.appendChild(div);
            }
        }

        function startGame() {
            const inputs = document.querySelectorAll('.player-input input');
            players = Array.from(inputs).map(input => ({
                name: input.value || `Jugador ${players.length + 1}`,
                letter: '',
                words: [],
                points: 0
            }));

            document.querySelector('.players-setup').style.display = 'none';
            showPrepareScreen();
        }

        function showPrepareScreen() {
            const player = players[currentPlayerIndex];
            const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
            player.letter = letters[Math.floor(Math.random() * letters.length)];
            
            gameState.words = [];
            gameState.letter = player.letter;
            gameState.timeLeft = 60;

            const prepareScreen = document.querySelector('.prepare-screen');
            prepareScreen.style.display = 'block';
            document.querySelector('.prepare-message').textContent = `¡${player.name}, es tu turno!`;
            document.querySelector('.prepare-screen .letter-display').textContent = player.letter;
        }

        function startPlayerTimer() {
            document.querySelector('.prepare-screen').style.display = 'none';
            document.querySelector('.game-screen').style.display = 'block';
            
            const player = players[currentPlayerIndex];
            document.querySelector('.current-player').textContent = `Turno de: ${player.name}`;
            document.querySelector('.game-screen .letter-display').textContent = player.letter;
            document.querySelector('.word-list').innerHTML = '';
            document.getElementById('word-input').value = '';
            
            startTimer();
            document.getElementById('word-input').focus();
        }

        function startTimer() {
            updateTimerDisplay();
            gameState.timerInterval = setInterval(() => {
                gameState.timeLeft--;
                updateTimerDisplay();
                
                if (gameState.timeLeft <= 0) {
                    endPlayerTurn();
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            document.querySelector('.timer').textContent = `${gameState.timeLeft}s`;
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                const input = document.getElementById('word-input');
                const word = input.value.trim().toUpperCase();
                
                if (isValidWord(word)) {
                    addWord(word);
                    input.value = '';
                }
            }
        }

        function isValidWord(word) {
            return word &&
                   word.startsWith(gameState.letter) &&
                   /^[A-ZÑ]+$/.test(word) &&
                   !gameState.words.includes(word);
        }

        function addWord(word) {
            gameState.words.push(word);
            const wordList = document.querySelector('.word-list');
            wordList.innerHTML += `<div>${word}</div>`;
            wordList.scrollTop = wordList.scrollHeight;
        }

        function endPlayerTurn() {
            clearInterval(gameState.timerInterval);
            document.querySelector('.game-screen').style.display = 'none';
            
            players[currentPlayerIndex].words = [...gameState.words];
            players[currentPlayerIndex].points = gameState.words.length;
            
            currentPlayerIndex++;
            
            if (currentPlayerIndex < players.length) {
                showPrepareScreen();
            } else {
                showResults();
            }
        }

        function showResults() {
            document.querySelector('.results-screen').style.display = 'block';
            
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
        }

        function resetGame() {
            currentPlayerIndex = 0;
            players = [];
            gameState = {
                words: [],
                letter: '',
                timeLeft: 60,
                timerInterval: null
            };
            
            document.querySelector('.results-screen').style.display = 'none';
            document.querySelector('.welcome-screen').style.display = 'block';
        }