const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

const tableName = 'battleship';

exports.getBoard = async (id) => {
    const params = {
        TableName: tableName,
        Key: { id },
    };
    
    return await docClient.get(params);
};

exports.putBoard = async (board) => {
    const params = {
        Item: board,
        TableName: tableName,
    }

    return await docClient.put(params);
}