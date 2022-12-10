/**
 * @module GameBoard - Represents the grid GameBoard of Tic-Tac-Toe.
 * @var _gameBoard - private array consisting of 9 cells
 * @function getCell - gets the cell
 * @function setCell - sets the cell
 * @returns getCell
 */
 var GameBoard = (() => {
    let _gameBoard = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];

    const getCell = (cellNum) => _gameBoard[cellNum];

    const setCell = (cellNum, currentPlayer) => {
        _gameBoard[cellNum] = currentPlayer;
    }

    return {
        getCell,
        setCell
    };
})();

/**
 * 
 * @param {string} name - name of player
 * @param {string} imgSrc - selected meme of player
 * 
 */
var Player = (name, imgSrc) => {
    let _name = name;
    let _imgSrc = imgSrc;

    const getName = () => _name;

    const getImage = () => {
        return _imgSrc;
    };

    const setName = (newName) => _name = newName;

    return {
        getName,
        getImage,
        setName
    };
};

/**
 * @module GameController - Controls the flow of the game itself
 */
var GameController = (() => {
    const _playerOne = Player('One', 'pictures/pikachu.png');
    const _playerTwo = Player('Two', 'pictures/mike_wazowski.png');
    let _isPlayerOne = true;
    
    const setPlayers = (names) => {
        _playerOne.setName(names[0]);
        _playerTwo.setName(names[1]);
    }

    const checkWins = (currentPlayer) => {
        const WINNING_COMBINATIONS = [
            // rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonals
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        for (let w = 0; w < WINNING_COMBINATIONS.length; w++) {
            let winCombo = WINNING_COMBINATIONS[w];
            let a = GameBoard.getCell(winCombo[0]);
            let b = GameBoard.getCell(winCombo[1]);
            let c = GameBoard.getCell(winCombo[2]);
            if (currentPlayer == a && a == b && b == c) return true;
        }

        return false;
    }

    const _isDraw = () => {
        const board = Array(9);
        for (let c = 0; c < 9; c++) {
            if (GameBoard.getCell(c) == '') return false;
            board[c] = GameBoard.getCell(c);
        }
        return true;
    }

    const _swapTurns = () => {
        _isPlayerOne = _isPlayerOne ? false : true;
        DisplayController.gameMessage();
    }

    const currentPlayer = () => _isPlayerOne ? _playerOne.getName() : _playerTwo.getName();

    const currentImg = () => _isPlayerOne ? _playerOne.getImage() : _playerTwo.getImage();

    const currentTurn = () => _isPlayerOne ? 'p-one' : 'p-two';

    const handleClick = (e) => {
        const cell = e.target;
        DisplayController.placeMark(cell, currentImg());
        if (checkWins(currentTurn())) {
            DisplayController.endMessage(false, currentPlayer());
        } else if (_isDraw()) {
          DisplayController.endMessage(true, currentPlayer());
        } else {
          _swapTurns();
        }
    }

    const startGame = () => {
        setPlayers(DisplayController.getNames());
        _isPlayerOne = true;
        DisplayController.refreshCells();
    }

    const restart = () => {
        setPlayers(['One', 'Two']);
    }

    return {
        checkWins,
        currentPlayer,
        currentImg,
        currentTurn,
        handleClick,
        startGame, 
        restart
    };
})();

/**
 * @module DisplayController - controls the display corresponding to the game flow
 */
var DisplayController = (() => {
    const game = document.getElementById('game-look');
    const cells = document.querySelectorAll('.cells');
    const message = document.getElementById('game-message');

    const secWindow = document.getElementById('pregame-two');
    const nameOne = document.getElementById('playerOne-name');
    const nameTwo = document.getElementById('playerTwo-name');

    const aiPlay = document.getElementById('ai-play');
    const multiPlay = document.getElementById('multi-play');
    
    const newGameBtn = document.getElementById('new-game');
    newGameBtn.addEventListener('click', GameController.startGame);
    const refreshBtn = document.getElementById('refresh');
    refreshBtn.addEventListener('click', () => {
        game.style.display = 'none';
        refreshCells();
        GameController.restart();

        nameOne.value = '';
        nameTwo.value = '';
        secWindow.style.display = 'inherit';
        secondWindow();
    });

    // const firstWindow = () => {
        
    // }

    const secondWindow = () => {
        const form = document.querySelector("#multiplay-form");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (nameOne.value.toLowerCase() == nameTwo.value.toLowerCase()) {
                alert('Names should not be the same!');
            } else if (nameOne.value.length < 2 || nameTwo.value.length < 2) {
                alert('Please type in a valid name with a minimum of 2 letters.');
            } else {
                secWindow.style.display = 'none';
                game.style.display = 'inherit';
                GameController.startGame();
            }
        });
    }

    const getNames = () => {
        return [nameOne.value, nameTwo.value];
    }

    const refreshCells = () => {
        for (let c = 0; c < 9; c++) {
            GameBoard.setCell(c, '');
        }
        cells.forEach(cell => {
            cell.classList.remove('p-one');
            cell.classList.remove('p-two');
            if (cell.hasChildNodes()) cell.removeChild(cell.firstChild);
            cell.removeEventListener('click', GameController.handleClick);
            cell.addEventListener('click', GameController.handleClick, { once: true });
        });

        gameMessage();
    }

    const gameMessage = () => {
        message.textContent = `It's ${GameController.currentPlayer()}'s turn!`;
    }

    const placeMark = (cell, imageSrc) => {
        const img = document.createElement('img');
        img.setAttribute('src', imageSrc);
        cell.classList.add(GameController.currentTurn());
        cell.appendChild(img);
        GameBoard.setCell(Number(cell.dataset.cell), GameController.currentTurn());
    }

    const endMessage = (draw, player) => {
        if (draw) {
            message.textContent = 'Draw!';
        } else {
            message.textContent = `${player} Wins!`;
            cells.forEach(cell => cell.removeEventListener('click', GameController.handleClick));
        }
    }

    return {
        // firstWindow,
        secondWindow,
        getNames,
        refreshCells,
        gameMessage,
        placeMark,
        endMessage
    };
})();

DisplayController.secondWindow();