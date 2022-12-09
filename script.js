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

var Player = (symbol, imgSrc) => {
    let _symbol = symbol;
    let _imgSrc = imgSrc;

    const getSymbol = () => _symbol;

    const getImage = () => {
        return _imgSrc;
    };

    return {
        getSymbol,
        getImage
    };
};

var GameController = (() => {
    const _playerOne = Player('Pika', 'pictures/pikachu.png');
    const _playerTwo = Player('Mike', 'pictures/mike_wazowski.png');
    let _isPlayerOne = true;
    
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

    const isDraw = () => {
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

    const currentSymbol = () => _isPlayerOne ? _playerOne.getSymbol() : _playerTwo.getSymbol();

    const currentImg = () => _isPlayerOne ? _playerOne.getImage() : _playerTwo.getImage();

    const handleClick = (e) => {
        const cell = e.target;
        DisplayController.placeMark(cell, currentSymbol(), currentImg());
        if (checkWins(currentSymbol())) {
            DisplayController.endMessage(false, currentSymbol());
        } else if (isDraw()) {
          DisplayController.endMessage(true, currentSymbol());
        } else {
          _swapTurns();
        }
    }

    const startGame = () => {
        _isPlayerOne = true;
        DisplayController.refreshCells();
    }

    return {
        checkWins,
        currentSymbol,
        currentImg,
        handleClick,
        startGame
    };
})();

var DisplayController = (() => {
    const cells = document.querySelectorAll('.cells');
    const message = document.getElementById('game-message');
    const restartBtn = document.getElementById('restart');
    restartBtn.addEventListener('click', GameController.startGame);

    const refreshCells = () => {
        for (let c = 0; c < 9; c++) {
            GameBoard.setCell(c, '');
        }

        cells.forEach(cell => {
            cell.classList.remove('X');
            cell.classList.remove('O');
            // cell.textContent = '';
            if (cell.hasChildNodes()) cell.removeChild(cell.firstChild);
            cell.removeEventListener('click', GameController.handleClick);
            cell.addEventListener('click', GameController.handleClick, { once: true });
        });

        gameMessage();
    }

    const gameMessage = () => {
        message.textContent = `It's ${GameController.currentSymbol()}'s turn!`;
    }

    const placeMark = (cell, currentPlayer, imageSrc) => {
        const img = document.createElement('img');
        img.setAttribute('src', imageSrc);
        cell.classList.add(currentPlayer);
        cell.appendChild(img);
        GameBoard.setCell(Number(cell.dataset.cell), currentPlayer);
    }

    const endMessage = (draw, player) => {
        if (draw) {
            message.textContent = 'Draw!'
        } else {
            message.textContent = `${player} Wins!`
            cells.forEach(cell => cell.removeEventListener('click', GameController.handleClick));
        }
    }

    // const _render = () => {
    //     for (let c = 0; c < 9; c++) cells[c].textContent = GameBoard.getCell(c);
    // }

    return {
        refreshCells,
        gameMessage,
        placeMark,
        endMessage
    };
})();

GameController.startGame();