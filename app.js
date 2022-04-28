
exports.handler = async (event) => {
    let requestBody = JSON.parse(event.body);
    return {
        statusCode: 200,
        body: 'action ' + requestBody.action + '\nlocation ' + requestBody.location,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}
