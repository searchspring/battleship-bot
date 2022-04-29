const actions = require('constants/actions');
const chars = require('constants/chars');
const gameConsts = require('constants/game');
const db = require('db');

exports.handler = async (event) => {
    const qs = require('querystring');
    const requestBody = qs.parse(event.body);

    const text = requestBody.text.toLowerCase().split(' ');
    const action = text[0];
    const args = text.slice(1);
    
    console.log('action:', action)
    console.log('args:', args);

    let board = generateBoard();
    printBoard(board);
    
    let message = '';
    
    try {
        switch (action) {
            case actions.START:
                message = start(requestBody.channel_name);
                break;
            case actions.FIRE:
                message = fire(requestBody.channel_name, requestBody.user_id, args[0]);
                break;
            case actions.JOIN:
                message = join(requestBody.channel_name, requestBody.user_id, args[0])
                break;
            case actions.LEAVE:
                message = leave(requestBody.channel_name, requestBody.user_id);
                break;
            case actions.STOP:
                message = stop(requestBody.channel_name);
                break;
            case actions.VIEW:
                message = view(requestBody.user_id);
                break;
            default:
                console.log('unsupported action');
        }
    } catch(error) {
        message = error;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            'channel': requestBody.channel_id,
            'text': message,
            // 'response_type': 'in_channel',
            'response_type': 'ephemeral', // Response is only visible for the person who triggered it.
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

function start(gameID) {
    let game = {
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

    // write to dynamo
    db.putBoard(game)
}

function generateBoard() {
    let board = [];
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i][j] = '0';
        }
    }

    // Randomly place the ships onto the board
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
    return Math.floor(Math.random() * (max - min + 1) + min)
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
    const game = db.getBoard(channelName);
    // generate the boards to render to the specific user
    let oppBoard = '';
    let selfBoard = '';
    
}

function renderSelfBoard(gameBoard, team) {
    let board = team === game.teams.red ? chars.HEADER_RED : chars.HEADER_BLUE;
    for (let i = 0; i < 10; i++) {
        let row = chars[i];
        for (let j = 0; j < 10; j++) {
            let emoji = iconKey[gameBoard[i][j]];
            row += emoji;
        }
    }
    return board;
}

function renderOppBoard(gameBoard, team) {
    let board = team === game.teams.red ? chars.HEADER_BLUE : chars.HEADER_RED;
    for (let i = 0; i < 10; i++) {
        let row = chars[i];
        for (let j = 0; j < 10; j++) {
            let emoji 
            if (gameBoard[i][j].match(/[a-z]0/)){
                // emoji = iconKey[]
            }else {
                emoji = iconKey[gameBoard[i][j]];
            }
            row += emoji;
        }
    }
    return board;
}

function getTeam(userID) {
    const team = '';
    if (game.teams.red.includes(userID)) {
        return game.teams.red;
    } else if (game.teams.blue.includes(userID)) {
        return game.teams.blue;
    }
    throw 'You are not part of a team yet! Try running the /battleship join <red|blue> command to join a team.';
}

function view(channelName, userID) {
    const team = getTeam(userID);
    return renderBoards(channelName, team);
}

function fire(channelName, userID, location) {
    // Fire action here
    // get game from dynamo
    location = location.toLowerCase();
    location = location.split();
    let game = db.getBoard(channelName);
    const team = getTeam(userID);
    if (game.boards[team][location[0]][location[1]] === '0') {
        game.boards[team][location[0]][location[1]] = '00';
        message = "MISS!";
    }

    if (game.boards[team][location[0]][location[1]] === '00') {
        throw "You've already fired at this location and missed! Try again";
    }
    
    if (game.boards[team][location[0]][location[1]].split()[1] === '1') {
        throw "You've already fired at this location and HIT! Try again";
    }

    if (game.boards[team][location[0]][location[1]] === 'a0') {
        game.boards[team][location[0]][location[1]] = 'a1';
        message = "HIT! You've hit the Carrier!";
    }

    if (game.boards[team][location[0]][location[1]] === 'b0') {
        game.boards[team][location[0]][location[1]] = 'b1';
        message = "HIT! You've hit the Battleship!";
    }

    if (game.boards[team][location[0]][location[1]] === 'c0') {
        game.boards[team][location[0]][location[1]] = 'c1';
        message = "HIT! You've hit the Cruiser!";
    }

    if (game.boards[team][location[0]][location[1]] === 'd0') {
        game.boards[team][location[0]][location[1]] = 'd1';
        message = "HIT! You've hit the Submarine!";
    }

    if (game.boards[team][location[0]][location[1]] === 'e0') {
        game.boards[team][location[0]][location[1]] = 'e1';
        message = "HIT! You've hit the Destroyer!";
    }

    
    db.putBoard(game);
    return message;
    // save the game state
}

function join(channelName, user, team) {
    // join user to team here action here
    let game = db.getBoard(channelName);

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

    // persist
    return db.putBoard(game);
}

function leave(channelName, user) {
    // remove user from team (need to figure out the team they are in or add team you're leaving to the command)

    // get the game board
    let game = db.getBoard(channelName);

    // assume user is on red team
    let location = game.teams.red.indexOf(user);
    let team = 'red';

    if (location == -1) {
        // didn't find user on red team, look on blue team
        location = game.teams.blue.indexOf(user);
        if (location !== -1) {
            // found on blue team
            team = 'blue';
        } else {
            // not found at all
            team, location = false;
        }
    }
    
    if (team && location) {
        // remove user
        game.teams[team].slice(location);
        
        // persist
        return db.putBoard(game);
    } else {
        throw "User was not removed from team, because they were not found.";
    }
}

function stop(channelName) {
    // end the game! stop it! kill it with fire!
}