const dynamodb = require('aws-sdk/clients/dynamodb');

const docClient = new dynamodb.DocumentClient();

const tableName = 'battleship';

exports.getBoard = (id) => {
    const params = {
        TableName: tableName,
        Key: { id },
    };
    
    return docClient.get(params).promise();
};

exports.putBoard = (board) => {
    const params = {
        Item: board,
        TableName: tableName,
    }

    return docClient.put(params).promise();
}