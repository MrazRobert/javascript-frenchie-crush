document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const width = 8
    const squares = []
    let score = 0
    const scoreDisplay = document.getElementById('score')
    let matchingCandy = []

    const candyColors = [
        'url(images/french-bulldog-mini-01.png)',
        'url(images/french-bulldog-mini-02.png)',
        'url(images/french-bulldog-mini-03.png)',
        'url(images/french-bulldog-mini-04.png)',
        'url(images/french-bulldog-mini-05.png)',
        'url(images/french-bulldog-mini-06.png)',
        'url(images/french-bulldog-mini-07.png)',
    ]

    // Creat board
    function createBoard() {
        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('draggable', true)
            square.setAttribute('id', i)
            let randomColor = Math.floor(Math.random() * candyColors.length)
            square.style.backgroundImage = candyColors[randomColor]
            grid.appendChild(square)
            squares.push(square)
        }
    }

    createBoard()

    // Drag the candies
    let colorBeingDragged
    let colorBeingReplaced
    let squareIdBeingDragged
    let squareIdBeingReplaced

    squares.forEach(square => square.addEventListener('dragstart', dragStart))
    squares.forEach(square => square.addEventListener('dragend', dragEnd))
    squares.forEach(square => square.addEventListener('dragover', dragOver))
    squares.forEach(square => square.addEventListener('dragenter', dragEnter))
    squares.forEach(square => square.addEventListener('dragleave', dragLeave))
    squares.forEach(square => square.addEventListener('drop', dragDrop))

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage
        squareIdBeingDragged = parseInt(this.id)
    }

    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {
        // this.style.backgroundImage = ''
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage
        squareIdBeingReplaced = parseInt(this.id)
        this.style.backgroundImage = colorBeingDragged
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
    }

    function dragEnd() {
        // What is a valid move?
        let validMoves = [
            squareIdBeingDragged+1,
            squareIdBeingDragged+width,
            squareIdBeingDragged-1,
            squareIdBeingDragged-width
        ]

        let validMove = validMoves.includes(squareIdBeingReplaced)

        if(squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null
        }else if(squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        }else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
        }
    }

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // Drop candies once some have been cleared
    async function moveIntoSquareBelow() {
        for(i = 0; i < width*width-width; i++) {
            if ((squares[i + width]).style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
                squares[i].style.backgroundImage = ''
                sleep(3000)
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
                const isFirstRow = firstRow.includes(i)
                if(isFirstRow && squares[i].style.backgroundImage === '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length)
                    squares[i].style.backgroundImage = candyColors[randomColor]
                }
            }
        }
    }

    // Check for matches
    async function checkForMatches() {
        await moveIntoSquareBelow()
        // checkRowForFour()
        // checkColumnForFour()
        await checkRowForThree()
        await checkColumnForThree()
        let uniq = [...new Set(matchingCandy)]
        matchingCandy = []
        score += uniq.length
        scoreDisplay.innerHTML = score
        uniq.forEach(index => {
            squares[index].style.backgroundImage = ''
        })
    }

    // // Check for row of four
    // function checkRowForFour() {
    //     for(let i = 0; i < width*width-3; i++) {
    //         let rowOfFour = [i, i+1, i+2, i+3]
    //         let decidedColor = squares[i].style/*.backgroundColor*/.backgroundImage
    //         const isBlank = squares[i].style/*.backgroundColor*/.backgroundImage === ''

    //         const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
    //         if(notValid.includes(i)) continue

    //         if(rowOfFour.every(index => squares[index].style/*.backgroundColor*/.backgroundImage === decidedColor && !isBlank)) {
    //             // score += 4
    //             // scoreDisplay.innerHTML = score
    //             rowOfFour.forEach(index => {
    //                 // squares[index].style/*.backgroundColor*/.backgroundImage = ''
    //                 matchingCandy.push(index)
    //             })
    //         }
    //     }
    // }
    // // checkRowForFour()

    // // Check for column of three
    // function checkColumnForFour() {
    //     for(let i = 0; i < width*width-3*width; i++) {
    //         let columnOfFour = [i, i+width, i+width*2, i+width*3]
    //         let decidedColor = squares[i].style/*.backgroundColor*/.backgroundImage
    //         const isBlank = squares[i].style/*.backgroundColor*/.backgroundImage === ''
    //         if(columnOfFour.every(index => squares[index].style/*.backgroundColor*/.backgroundImage === decidedColor && !isBlank)) {
    //             // score += 4
    //             // scoreDisplay.innerHTML = score
    //             columnOfFour.forEach(index => {
    //                 // squares[index].style/*.backgroundColor*/.backgroundImage = ''
    //                 matchingCandy.push(index)
    //             })
    //         }
    //     }
    // }
    // // checkColumnForFour()

    // Check for row of three
    async function checkRowForThree() {
        for(let i = 0; i < width*width-2; i++) {
            let rowOfThree = [i, i+1, i+2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''

            // const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
            // if(notValid.includes(i)) continue

            if((i+1) % width === 0 || (i+1) % width === width-1) continue

            if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                rowOfThree.forEach(index => {
                    matchingCandy.push(index)
                })
            }
        }
    }
    // checkRowForThree()

    // Check for column of three
    async function checkColumnForThree() {
        for(let i = 0; i < width*width-2*width; i++) {
            let columnOfThree = [i, i+width, i+width*2]
            let decidedColor = squares[i].style.backgroundImage
            const isBlank = squares[i].style.backgroundImage === ''
            if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                columnOfThree.forEach(index => {
                    matchingCandy.push(index)
                })
            }
        }
    }
    // checkColumnForThree()

    window.setInterval(async () => {
        await checkForMatches()
    }, 100)
})