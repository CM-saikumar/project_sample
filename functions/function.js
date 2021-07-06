
exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event));

    return sendResult(200, "hello starting development");
};

const sendResult = (status, body) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type":"text/html",
        },
        body: body,
    };
    return response;
};