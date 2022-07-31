let winArr = [['0', '1', '2'], ['0', '3', '6'], ['0', '4', '8'], ['1', '4', '7'], ['2', '4', '6'], ['2', '5', '8'], ['3', '4', '5'], ['6', '7', '8']];
let pathList = ['./png/o1.png', './png/o2.png', './png/o3.png', './png/o4.png', './png/o5.png']
let pathPos = 0;
let loggedPlayer = JSON.parse(localStorage.getItem('currentLoggedPlayer'));
let guestPlayer = JSON.parse(localStorage.getItem('currentGuestPlayer'));
let tie = JSON.parse(localStorage.getItem('currentTie'));
let curentPlayerSimbol;
let playerX = [];
let playerO = [];
let turns = 0;

window.onload = function () {
    console.log(guestPlayer);
    console.log(loggedPlayer);
    console.log(tie);

    createTable();
    setScoreTable();

    curentPlayerSimbol = (Math.round(Math.random())) > 0 ? 'x' : 'o';
    currentPlayer(curentPlayerSimbol);

    function createTable() {
        let table = document.createElement('table');
        table.id = 'table';
        document.body.append(table)
        for (let i = 0; i < 3; i++) {
            let row = document.createElement('tr');
            table.appendChild(row);
            for (let x = 0; x < 3; x++) {
                let data = document.createElement('td');
                data.id = `${x + i * 3}`;
                data.classList += ('data');
                data.addEventListener('click', onClick)
                row.appendChild(data);
            }
        }
    }

    function setScoreTable() {
        document.getElementById('logged').textContent = loggedPlayer.name + " - x";
        document.getElementById('loggedScore').textContent = loggedPlayer.score;
        document.getElementById('guest').textContent = guestPlayer.name + " - o";
        document.getElementById('guestScore').textContent = guestPlayer.score;
        document.getElementById('tieScore').textContent = tie.score;

    }

    function currentPlayer(symbole, b = false) {
        let cssCurr = 'color: black; background-color: white'
        let cssNone = 'color: white; background: ""'
        // document.getElementById('logged').classList.toggle("currentTurn");
        // document.getElementById('guest').classList.toggle("currentTurn");
        document.getElementById('logged').style.cssText = symbole == 'x' ? cssCurr : cssNone;
        document.getElementById('guest').style.cssText = symbole == 'o' ? cssCurr : cssNone;
        if (b) {
            document.getElementById('loggedScore').style.cssText = symbole == 'x' ? cssCurr : cssNone;
            document.getElementById('guestScore').style.cssText = symbole == 'o' ? cssCurr : cssNone;
            document.getElementById('tieScore').style.cssText = symbole == 't' ? cssCurr : cssNone;
            document.getElementById('tie').style.cssText = symbole == 't' ? cssCurr : cssNone;

        }
    }

    function onClick() {
        setData(this);
        addClickedId(this.id);
        if (checkResult()) {
            console.log("got into if checkResult");
            let data = document.getElementsByClassName('data');
            for (i of data) {
                i.removeEventListener('click', onClick)
            }
            endGame(curentPlayerSimbol);
            console.log(curentPlayerSimbol + ' is now')

        } else {
            turns++
            turns < 9 ? changePlayer() : endGame('t')
        }

        this.removeEventListener('click', onClick);
    }

    function setData(element) {
        let img = document.createElement('div')
        img.classList += ('img');
        element.appendChild(img);
        img.style.backgroundImage = 'url("' + setImg() + '")'
    }

    function setImg() {
        if (curentPlayerSimbol == 'o') {
            pathPos++
            return pathList[pathPos - 1];
        } else {
            return './png/x.png'
        }
    }

    function addClickedId(id) {
        if (curentPlayerSimbol == 'x') {
            playerX.push(id)
        } else {
            playerO.push(id)
        }
    }

    function checkResult() {
        let cssTxt = 'background-color: redrgba(255,255,255,0.5); animation-name: flicker; animation-duration: 2s;'
        let player = (curentPlayerSimbol == 'x') ? playerX : playerO;
        for (let i of winArr) {
            if (i.every(num => player.includes(num))) {
                i.forEach(id => document.getElementById(id).style.cssText = cssTxt);
                return true
            }
        }
        return false;
    }

    function changePlayer() {
        curentPlayerSimbol = (curentPlayerSimbol == 'x') ? 'o' : 'x';
        currentPlayer(curentPlayerSimbol);
    }

    function endGame(symbole) {
        if (symbole == 't') {
            // document.getElementById("winMessage").style.visibility = 'visible';
            tie.score += 1;
            document.getElementById('tieScore').innerHTML = tie.score;
            localStorage.setItem('currentTie', JSON.stringify(tie));
            setWinMessage('t')
        } else if (symbole == 'x') {
            loggedPlayer.score += 1;
            document.getElementById('loggedScore').innerHTML = loggedPlayer.score;
            localStorage.setItem('currentLoggedPlayer', JSON.stringify(loggedPlayer));
            setTimeout(setWinMessage, 2000, 'x');
        } else {
            guestPlayer.score += 1;
            document.getElementById('guestScore').innerHTML = guestPlayer.score;
            localStorage.setItem('currentGuestPlayer', JSON.stringify(guestPlayer));
            setTimeout(setWinMessage, 2000, 'o');
        }
        currentPlayer(symbole, true);
        

    }

    function setWinMessage(symbole) {
        console.log(symbole + 'won message')
        document.getElementById('table').remove();
        document.getElementById("tableBox").style = 'display: block; margin-top: 100px';
        if (symbole != 't') {
            let imgSrc = symbole == 'x' ? './png/x.png' : './png/o6.png';
            let message = symbole == 'x' ? loggedPlayer.name + ' won!' : guestPlayer.name + ' won!'
            document.getElementById('winImg').src = imgSrc;
            document.getElementById('winMessage').innerHTML = message;
            console.log('x or o')
        }
       
    }
}