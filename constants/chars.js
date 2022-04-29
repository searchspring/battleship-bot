const RED_SQUARE = ':large_red_square: ';
const BLUE_SQUARE = ':large_blue_square: ';
const ONE = ':one: ';
const TWO = ':two: ';
const THREE = ':three: ';
const FOUR = ':four: ';
const FIVE = ':five: ';
const SIX = ':six: ';
const SEVEN = ':seven: ';
const EIGHT = ':eight: ';
const NINE = ':nine: ';
const TEN = ':keycap_ten: ';
const NEWLINE = '\n';
const HEADER_RED = `${RED_SQUARE}${ONE}${TWO}${THREE}${FOUR}${FIVE}${SIX}${SEVEN}${EIGHT}${NINE}${TEN}${NEWLINE}`;
const HEADER_BLUE = `${BLUE_SQUARE}${ONE}${TWO}${THREE}${FOUR}${FIVE}${SIX}${SEVEN}${EIGHT}${NINE}${TEN}${NEWLINE}`;
const ROW_A = ':alphabet-yellow-a: ';
const ROW_B = ':alphabet-yellow-b: ';
const ROW_C = ':alphabet-yellow-c: ';
const ROW_D = ':alphabet-yellow-d: ';
const ROW_E = ':alphabet-yellow-e: ';
const ROW_F = ':alphabet-yellow-f: ';
const ROW_G = ':alphabet-yellow-g: ';
const ROW_H = ':alphabet-yellow-h: ';
const ROW_I = ':alphabet-yellow-i: ';
const ROW_J = ':alphabet-yellow-j: ';

const alphaNumKey = {
    0: ROW_A,
    1: ROW_B,
    2: ROW_C,
    3: ROW_D,
    4: ROW_E,
    5: ROW_F,
    6: ROW_G,
    7: ROW_H,
    8: ROW_I,
    9: ROW_J,
}

const iconKey = {
    "0": ":large_blue_square: ",
    "00": ":sweat-drops: ",
    "a0": ":ship: ",
    "b0": ":passenger_ship: ",
    "c0": ":motor_boat: ",
    "d0": ":canoe: ",
    "e0": ":speedboat: ",
    "a1": ":boom: ",
    "b1": ":boom: ",
    "c1": ":boom: ",
    "d1": ":boom: ",
    "e1": ":boom: ",
}

module.exports = { 
    RED_SQUARE, 
    BLUE_SQUARE, 
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    NEWLINE,
    HEADER_RED,
    HEADER_BLUE,
    ROW_A,
    ROW_B,
    ROW_C,
    ROW_D,
    ROW_E,
    ROW_F,
    ROW_G,
    ROW_H,
    ROW_I,
    ROW_J,
    iconKey,
    alphaNumKey,
};