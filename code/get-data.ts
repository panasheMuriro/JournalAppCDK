// const { DynamoDB, Lambda } = require("aws-sdk"); // uncomment this in the console

exports.handler = async function (event: any) {

  // create AWS SDK clients
  const dynamo = new DynamoDB();

  const queryResult = await dynamo
    .scan({
      TableName: process.env.JOURNAL_TABLE,
    })
    .promise();

    // helper to format the data
  const items = queryResult.Items.map((item:any) => {
    let obj:any = {};
    Object.keys(item).map((x) => {
      obj[x] = Object.values(item[x])[0];
    });
    return obj;
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: items
    }),
  };
};
