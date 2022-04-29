const actions = require('./constants/actions');
const chars = require('./constants/chars');
const gameConsts = require('./constants/game');

var game = {};

module.exports.handler =  (requestBody) => {
    const text = requestBody.text.toLowerCase().split(' ');
    const action = text[0];
    const args = text.slice(1);
    
    let message = '';
    let response_type = "ephemeral";
    try {
        switch (action) {
            case actions.START:
                message = start(requestBody.channel_name);
                response_type = "in_channel";
                break;
            case actions.FIRE:
                message = fire(requestBody.channel_name, requestBody.user_id, args[0], requestBody.user_name);
                response_type = "in_channel";
                break;
            case actions.JOIN:
                message = join(requestBody.channel_name, requestBody.user_id, args[0], requestBody.user_name)
                response_type = "in_channel";
                break;
            case actions.LEAVE:
                message = leave(requestBody.channel_name, requestBody.user_id, requestBody.user_name);
                response_type = "in_channel";
                break;
            case actions.STOP:
                message = stop(requestBody.channel_name);
                response_type = "in_channel";
                break;
            case actions.VIEW:
                message = view(requestBody.channel_name, requestBody.user_id);
                response_type = "ephemeral";
                break;
            default:
                console.log('unsupported action');
                break;
        }
    } catch(error) {
        console.log('error:', error)
        message = error;
        response_type = "ephemeral";
    }

    return {
        response_type: response_type,
        text: message,
    };
}

function start(gameID) {
    let newGame = {
        id: gameID,
        teams: {
            red: [],
            blue: [],
        },
        hitCount: {
            red: 0,
            blue: 0,
        },
        boards: {
            red: generateBoard(),
            blue: generateBoard(),
        },
    };

    // save the game state
    game = {...newGame};

    return 'Game has started!';
}

function generateBoard() {
    let board = [];
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i][j] = '0';
        }
    }

    // randomly place the ships onto the board
    Object.keys(gameConsts.ships).forEach(shipType => {
        placeShipRandomly(shipType, gameConsts.ships[shipType].length, board);
    });

    return board;
}

function placeShipRandomly(type, length, board) {
    const directions = ['north', 'south', 'east', 'west'];
    let randomShipPosition = [0, 0];
    let randomDirection = directions[0];

    do {
        randomShipPosition = [randomIntFromInterval(0, 9), randomIntFromInterval(0, 9)];
        randomDirection = directions[randomIntFromInterval(0, 3)];
    } while (!isValidShipLocation(randomShipPosition, randomDirection, length, board))
    
    for (let i = 0; i < length; i++) {
        switch (randomDirection) {
            case 'north':
                board[randomShipPosition[0] - i][randomShipPosition[1]] = type;
                break;
            case 'south':
                board[randomShipPosition[0] + i][randomShipPosition[1]] = type;
                break;
            case 'east':
                board[randomShipPosition[0]][randomShipPosition[1] + i] = type;
                break;
            case 'west':
                board[randomShipPosition[0]][randomShipPosition[1] - i] = type;
                break;
            default:
                console.log('Invalid direction found in placeShipRandomly');
                break;
        }
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isValidShipLocation(position, direction, length, board) {
    for (let i = 0; i < length; i++) {
        switch (direction) {
            case 'west':
                if (board[position[0]][position[1] - i] !== '0')
                    return false;
                break;
            case 'east':
                if (board[position[0]][position[1] + i] !== '0')
                    return false;
                break;
            case 'south':
                if (!board[position[0] + i] || board[position[0] + i][position[1]] !== '0')
                    return false;
                break;
            case 'north':
                if (!board[position[0] - i] || board[position[0] - i][position[1]] !== '0')
                    return false;
                break;
            default:
                console.log('Invalid direction found in isValidShipLocation');
                return false;
        }
    }
    
    return true;
}

function printBoard(board) {
    for (let i = 0; i < 10; i++) {
        let row = '';
        for (let j = 0; j < 10; j++) {
            row = row + board[i][j] + ' ';
        }
        console.log(row);
    }
}

function renderBoards(channelName, team) {
    // generate the boards to render to the specific user
    const oppTeam = team === gameConsts.teams.red ? gameConsts.teams.blue: gameConsts.teams.red;
    let oppBoard = renderOppBoard(game.boards[oppTeam], team);
    let selfBoard = renderSelfBoard(game.boards[team], team);
    return oppBoard + '\n\n' + selfBoard;

}

function renderSelfBoard(gameBoard, team) {
    let board = team === gameConsts.teams.red ? chars.HEADER_RED : chars.HEADER_BLUE;
    for (let i = 0; i < 10; i++) {
        let row = chars.alphaNumKey[i];
        for (let j = 0; j < 10; j++) {
            let emoji = chars.iconKey[gameBoard[i][j]];
            row += emoji;
        }
        row += chars.NEWLINE;
        board += row;
    }
    return board;
}

function renderOppBoard(gameBoard, team) {
    let board = team === gameConsts.teams.red ? chars.HEADER_BLUE : chars.HEADER_RED;
    for (let i = 0; i < 10; i++) {
        let row = chars.alphaNumKey[i];
        for (let j = 0; j < 10; j++) {
            let emoji;
            if (gameBoard[i][j].match(/[a-z]0/)){
                emoji = chars.iconKey['0'];
            }else {
                emoji = chars.iconKey[gameBoard[i][j]];
            }
            row += emoji;
        }
        row += chars.NEWLINE;
        board += row;
    }
    return board;
}

function getTeam(userID) {
    const team = '';
    if (game.teams.red.includes(userID)) {
        return gameConsts.teams.red;
    } else if (game.teams.blue.includes(userID)) {
        return gameConsts.teams.blue;
    }
    throw 'You are not part of a team yet! Try running "/battleship join <red|blue>" to join a team.';
}

function view(channelName, userID) {
    const team = getTeam(userID);
    return renderBoards(channelName, team);
}

function fire(channelName, userID, location, userName) {

    if (!location) return "Need a location for your missle";

    // Fire action here
    location = location.toLowerCase();
    location = location.split('');
    location[0] = location[0].charCodeAt(0) - 97;
    location[1] = location.length > 2 ? location[1] + location[2] - 1 : location[1] - 1;
    const myTeam = getTeam(userID);
    const team = myTeam === gameConsts.teams.red ? gameConsts.teams.blue : gameConsts.teams.red;
    
    if (game.boards[team][location[0]][location[1]] === '0') {
        game.boards[team][location[0]][location[1]] = '00';
        message = "MISS!";
    } else if (game.boards[team][location[0]][location[1]] === '00') {
        return "Stop wasting your missles!! You've already fired at this location and missed! Try again";
    } else if (game.boards[team][location[0]][location[1]].split('')[1] === '1') {
        return "Stop wasting your missles!! You've already fired at this location and HIT! Try again";
    } else if (game.boards[team][location[0]][location[1]] === 'a0') {
        game.boards[team][location[0]][location[1]] = 'a1';
        message = "HIT! " + userName + " has hit the " + team + " team's Carrier!";
        game.hitCount[team]++
        if (isShipSunk(team, 'a0')) {
            message = userName + " has sank the "  + team + " team's Carrier!";
        }
    } else if (game.boards[team][location[0]][location[1]] === 'b0') {
        game.boards[team][location[0]][location[1]] = 'b1';
        message = "HIT!  " + userName + " has hit the " + team + " team's Battleship!";
        game.hitCount[team]++
        if (isShipSunk(team, 'b0')) {
            message = userName + " has sank the "  + team + " team's Battleship!";
        }
    } else if (game.boards[team][location[0]][location[1]] === 'c0') {
        game.boards[team][location[0]][location[1]] = 'c1';
        message = "HIT!  " + userName + " has hit the " + team + " team's Cruiser!";

        game.hitCount[team]++
        if (isShipSunk(team, 'c0')) {
            message = userName + " has sank the "  + team + " team's Cruiser!";
        }
    } else if (game.boards[team][location[0]][location[1]] === 'd0') {
        game.boards[team][location[0]][location[1]] = 'd1';
        game.hitCount[team]++

        message = "HIT!  " + userName + " has hit the " + team + " team's Submarine!";

        if (isShipSunk(team, 'd0')) {
            message = userName + " has sank the "  + team + " team's Submarine!";
        }
    } else if (game.boards[team][location[0]][location[1]] === 'e0') {
        game.boards[team][location[0]][location[1]] = 'e1';
        game.hitCount[team]++
        message = "HIT!  " + userName + " has hit the " + team + " team's Destroyer!";
        
        if (isShipSunk(team, 'e0')) {
            message = userName + " has sank the "  + team + " team's Destroyer!";
        }
    }

    if (game.hitCount.red > 17) {
        game = {};
        return 'Red team wins! Please play again.';
    } else if (game.hitCount.blue > 17) {
        game = {};
        return 'Blue team wins! Please play again.';
    }

    const board = renderOppBoard(game.boards[team], myTeam);
    return board + '\n' + message;
}

function join(channelName, user, team, userName) {
    // team was not specified or didn't match a real team. 
    // place user in team with fewest members, or random if equal
    if (!team || !gameConsts.teams[team]) {
        if (game.teams.red.length == game.teams.blue.length) {
            // equal sized teams, choose at random
            team = Math.floor(Math.random() * 2) == 1 ? 'red' : 'blue'
        } else if (game.teams.red.length < game.teams.blue.length) {
            // red had fewer
            team = 'red';
        } else {
            // blue had fewer
            team = 'blue';
        }
    }
    
    game.teams[team].push(user);
    return userName + ' has joined team ' + team;
}

function leave(channelName, userID, userName) {
    // remove user from team (need to figure out the team they are in or add team you're leaving to the command)
    const team = getTeam(userID);
    const newTeam = game.teams[team].filter(id => id !== userID);
    game.teams[team] = newTeam;
    return userName + ' has left team ' + team;
}

function stop(channelName) {
    const msg = `The game has ended. Final score is: Red - ${game.hitCount.red}, Blue - ${game.hitCount.blue}`;
    game = {};
    return msg;
}

function isShipSunk(team, ship) {
    for (let i = 0; i < 10; i++) {
        if (game.boards[team][i].includes(ship)){
            return false;
        }
    }
    
    return true;
    
}