const RED_SQUARE = ':large_red_square:';
const SEA = ':large_blue_square:';
const ONE = ':one:';
const TWO = ':two:';
const THREE = ':three:';
const FOUR = ':four:';
const FIVE = ':five:';
const SIX = ':six:';
const SEVEN = ':seven:';
const EIGHT = ':eight:';
const NINE = ':nine:';
const ZERO = ':zero:'
const NEWLINE = '\n';

exports.handler = async (event) => {
    console.log(event);
    let qs = require('querystring');
    let requestBody = qs.parse(event.body);
    return {
        statusCode: 200,
        body: JSON.stringify({
            'channel': requestBody.channel_id,
            'text': ONE + TWO + THREE + FOUR + FIVE + SIX + SEVEN + EIGHT + NINE + ZERO + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
                + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + SEA + NEWLINE
            ,
            // 'response_type': 'in_channel',
            'response_type': 'ephemeral', // Response is only visible for the person who triggered it.
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
