const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event: any) {

  const dynamo = new DynamoDB();

  const requestBody = JSON.parse(event.body);
  const { id, category, content, date_created, username } = requestBody;
  await dynamo
    .updateItem({
      TableName: process.env.JOURNAL_TABLE,
      Key: { id: { S: id } },
      UpdateExpression:
        "SET Category = :cat, Content = :con, DateCreated = :dat, Username = :usr",
      ExpressionAttributeValues: {
        ":cat": { S: category },
        ":con": { S: content },
        ":dat": { S: date_created },
        ":usr": { S: username },
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Posted data to the DynamoDB successfully"
    }),
  };
};


/**
 * Output format as an array of the following:
 * 
 * {
    "id": "12345678934",
    "category": "cooking",
    "content" : "I love cooking so much on Fridays",
    "date_created" : "23 August 2023",
    "username" : "Panashe" 
}
 */