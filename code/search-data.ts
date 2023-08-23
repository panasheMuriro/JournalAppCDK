/**
 * Cloudsearch Logic
 */
const AWS = require("aws-sdk");
// Create a new instance of the AWS CloudSearchDomain class
const cloudsearchdomain = new AWS.CloudSearchDomain({
  endpoint:
    "search-journal-search-domain-bh76fhzpbzg3j6ih3de2tnnshy.us-east-1.cloudsearch.amazonaws.com", // Replace with your Amazon CloudSearch endpoint
});

exports.handler = async (event: any) => {
  try {
    const searchText = event.queryStringParameters.q;

    const searchParams = {
      query: searchText,
    };

    const searchResponse = await cloudsearchdomain
      .search(searchParams)
      .promise();

    // Extract and format search results from the response
    const searchResults = searchResponse.hits.hit;

    const formattedResults = searchResults.map((result: any) => {
      const { datecreated, id, category, content, username } = result.fields;
      return {
        datecreated: datecreated[0],
        id: id[0],
        category: category[0],
        content: content[0],
        username: username[0],
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(formattedResults),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
