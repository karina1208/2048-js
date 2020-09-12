document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    let highScoreDisplay = document.getElementById('highscore')
    const finishBlock = document.getElementById('finishBlock')
    const width = 4
    let squares = []
    let score = 0
    let highScore = 0
    let isWin = false

    if (sessionStorage.getItem("high")) {
        // -------- Restore the contents of the text field -------- //
        highScore = sessionStorage.getItem("high");
        highScoreDisplay.innerHTML = highScore
    }

    function setHighScore() {
        if (score > highScore) highScore = score
        sessionStorage.setItem("high", highScore);

        highScoreDisplay.innerHTML = highScore
    }

    // -------- text effect -------- //
    // -------- Wrap every letter in a span -------- //
    var textWrapper = document.querySelector('.ml1 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    function wordEffect() {

        anime.timeline({ loop: false })
            .add({
                targets: '.ml1 .letter',
                scale: [0.3, 1],
                opacity: [0, 1],
                translateZ: 0,
                easing: "easeOutExpo",
                duration: 900,
                delay: (el, i) => 70 * (i + 1)
            }).add({
                targets: '.ml1 .line',
                scaleX: [0, 1],
                opacity: [0.5, 1],
                easing: "easeOutExpo",
                duration: 900,
                offset: '-=875',
                delay: (el, i, l) => 80 * (l - i)
            });

    }

    function reset() {
        grid.innerHTML = ''
        scoreDisplay.innerHTML = '0'
        score = 0
        header.innerHTML = '2048'

        // -------- Wrap every letter in a span -------- //
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        squares = []
        isWin = false
        game.style.visibility = 'hidden'
        document.addEventListener('keydown', control)
    }

    function createBoard() {
        reset()

        for (let i = 0; i < width * width; i++) {
            square = document.createElement('div')
            square.innerHTML = 0
            square.classList.add('innerBox')
            changeColor(square)
            grid.appendChild(square)
            squares.push(square)

        }

        generate()
        generate()

        // -------- testing -------- //
        // square = document.createElement('div')
        // square.innerHTML = 0
        // square.classList.add('innerBox')
        // changeColor(square)
        // grid.appendChild(square)
        // squares.push(square)

        // for (let i = 1; i < 16; i++) {

        //     square = document.createElement('div')
        //     square.innerHTML = Math.pow(2, i)
        //     square.classList.add('innerBox')
        //     changeColor(square)
        //     grid.appendChild(square)
        //     squares.push(square)
        // }
        // -------- end of testing -------- //



    }
    createBoard()

    function generate() {

        let randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerHTML == 0) {
            const ranList = [2, 2, 2, 4, 2]
            let ran = Math.floor(Math.random() * ranList.length)
            squares[randomNumber].innerHTML = ranList[ran]
            changeColor(squares[randomNumber])
            checkForLose()
        } else {
            generate()
        }
    }


    function swipeRight() {
        for (let i = 0; i < width; i++) {
            let row = []
            for (let j = 0; j < width; j++) {
                let temp = parseInt(squares[i * width + j].innerHTML)
                row.push(temp)
            }

            let filteredRow = row.filter(num => num)

            let missing = 4 - filteredRow.length
            let zeros = Array(missing).fill(0)

            let newRow = zeros.concat(filteredRow)


            for (let k = 0; k < width; k++) {

                squares[i * width + k].innerHTML = newRow[k]
                changeColor(squares[i * width + k])
            }

        }
    }

    function swipeLeft() {
        for (let i = 0; i < width; i++) {
            let row = []
            for (let j = 0; j < width; j++) {

                let temp = parseInt(squares[i * width + j].innerHTML)
                row.push(temp)

            }

            let filteredRow = row.filter(num => num)

            let missing = 4 - filteredRow.length
            let zeros = Array(missing).fill(0)

            let newRow = filteredRow.concat(zeros)

            for (let k = 0; k < width; k++) {
                squares[i * width + k].innerHTML = newRow[k]
                changeColor(squares[i * width + k])
            }

        }
    }

    function swipeDown() {
        for (let i = 0; i < width; i++) {
            let column = []
            for (let j = 0; j < width; j++) {
                let temp = parseInt(squares[j * width + i].innerHTML)
                column.push(temp)
            }

            let filteredColumn = column.filter(num => num)

            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)

            let newColumn = zeros.concat(filteredColumn)

            for (let k = 0; k < width; k++) {

                squares[k * width + i].innerHTML = newColumn[k]
                changeColor(squares[k * width + i])
            }

        }
    }

    function swipeUp() {
        for (let i = 0; i < width; i++) {
            let column = []
            for (let j = 0; j < width; j++) {
                let temp = parseInt(squares[j * width + i].innerHTML)
                column.push(temp)
            }

            let filteredColumn = column.filter(num => num)

            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)

            let newColumn = filteredColumn.concat(zeros)

            for (let k = 0; k < width; k++) {

                squares[k * width + i].innerHTML = newColumn[k]
                changeColor(squares[k * width + i])
            }

        }
    }

    function addLeft() {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width - 1; j++) {
                let temp = i * width + j
                if (squares[temp].innerHTML === squares[temp + 1].innerHTML) {
                    let combinedTotal = parseInt(squares[temp].innerHTML) + parseInt(squares[temp + 1].innerHTML)
                    squares[temp].innerHTML = combinedTotal
                    squares[temp + 1].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                    setHighScore()
                }
            }
        }

        if (!isWin) checkForWin()
    }

    function addRight() {
        for (let i = 0; i < width; i++) {
            for (let j = width - 1; j > 0; j--) {
                let temp = i * width + j

                if (squares[temp].innerHTML === squares[temp - 1].innerHTML) {
                    let combinedTotal = parseInt(squares[temp].innerHTML) + parseInt(squares[temp - 1].innerHTML)
                    squares[temp].innerHTML = combinedTotal
                    squares[temp - 1].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                    setHighScore()
                }
            }
        }
        if (!isWin) checkForWin()
    }

    function addDown() {
        for (let i = width - 1; i > 0; i--) {
            for (let j = 0; j < width; j++) {
                let temp = i * width + j

                if (squares[temp].innerHTML === squares[temp - width].innerHTML) {
                    let combinedTotal = parseInt(squares[temp].innerHTML) + parseInt(squares[temp - width].innerHTML)
                    squares[temp].innerHTML = combinedTotal
                    squares[temp - width].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                    setHighScore()
                }
            }
        }
        if (!isWin) checkForWin()
    }

    function addUp() {
        for (let i = 0; i < width - 1; i++) {
            for (let j = 0; j < width; j++) {

                let temp = i * width + j

                if (squares[temp].innerHTML === squares[temp + width].innerHTML) {

                    let combinedTotal = parseInt(squares[temp].innerHTML) + parseInt(squares[temp + width].innerHTML)
                    squares[temp].innerHTML = combinedTotal
                    squares[temp + width].innerHTML = 0
                    score += combinedTotal
                    scoreDisplay.innerHTML = score
                    setHighScore()

                }


            }
        }
        if (!isWin) checkForWin()
    }

    function control(e) {
        e.preventDefault()
        if (e.key === 'ArrowRight' || e.which === 68 || e.code === 'KeyD') {
            e.preventDefault()
            swipeRight()
            addRight()
            swipeRight()
            generate()
        } else if (e.key === 'ArrowLeft' || e.which === 65 || e.code === 'KeyA') {
            e.preventDefault()
            swipeLeft()
            addLeft()
            swipeLeft()
            generate()
        } else if (e.key === 'ArrowDown' || e.which === 83 || e.code === 'KeyS') {
            e.preventDefault()
            swipeDown()
            addDown()
            swipeDown()
            generate()
        } else if (e.key === 'ArrowUp' || e.which === 87 || e.code === 'KeyW') {
            e.preventDefault()
            swipeUp()
            addUp()
            swipeUp()
            generate()
        }
    }

    document.addEventListener('keydown', control)

    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                wordEffect()
                isWin = true
                ml1.classList.add('pass')

            }
        }
    }

    function checkForLose() {
        let zeros = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) zeros++
        }
        // --------- if board do not have zero, check if their still have moves --------- //
        if (zeros === 0) {
            let isLose = true
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < width - 1; j++) {
                    let temp = i * width + j
                    if (squares[temp].innerHTML === squares[temp + 1].innerHTML) {
                        // --------- if left/right cell is the same value = still have moves --------- //
                        isLose = false
                    }
                }
            }
            for (let i = 0; i < width - 1; i++) {
                for (let j = 0; j < width; j++) {
                    let temp = i * width + j

                    if (squares[temp].innerHTML === squares[temp + width].innerHTML) {
                        // --------- if up/down cell is the same value = still have moves --------- //
                        isLose = false
                    }
                }
            }

            if (isLose) {
                endGame()
            }
        }
    }

    function endGame() {
        header.innerHTML = 'End'

        // -------- Wrap every letter in a span -------- //
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        ml1.classList.remove('pass')
        wordEffect()

        document.removeEventListener('keydown', control)
        game.style.visibility = 'visible'

        finishBlock.style.height = "300px"
    }

    // -------- start new game -------- //
    game.addEventListener('click', function(e) {
        isLose = false
        createBoard()
    })


    function changeColor(cell) {
        cell.className = 'innerBox';

        switch (parseInt(cell.innerHTML)) {
            case 0:
                cell.classList.add("p2_0")
                break;
            case Math.pow(2, 1):
                cell.classList.add("p2_1")
                break;
            case Math.pow(2, 2):
                cell.classList.add("p2_2")
                break;
            case Math.pow(2, 3):
                cell.classList.add("p2_3")
                break;
            case Math.pow(2, 4):
                cell.classList.add("p2_4")
                break;
            case Math.pow(2, 5):
                cell.classList.add("p2_5")
                break;
            case Math.pow(2, 6):
                cell.classList.add("p2_6")
                break;
            case Math.pow(2, 7):
                cell.classList.add("p2_7")
                break;
            case Math.pow(2, 8):
                cell.classList.add("p2_8")
                break;
            case Math.pow(2, 9):
                cell.classList.add("p2_9")
                break;
            case Math.pow(2, 10):
                cell.classList.add("p2_10")
                break;
            case Math.pow(2, 11):
                cell.classList.add("p2_11")
                break;
            case Math.pow(2, 12):
                cell.classList.add("p2_12")
                break;
            case Math.pow(2, 13):
                cell.classList.add("p2_13")
                break;
            case Math.pow(2, 14):
                cell.classList.add("p2_14")
                break;
            case Math.pow(2, 15):
                cell.classList.add("p2_15")
                break;
            case Math.pow(2, 16):
                cell.classList.add("p2_16")
                break;
            case Math.pow(2, 17):
                cell.classList.add("p2_17")
                break;
        }
    }

})