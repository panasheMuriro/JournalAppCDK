import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class APILambdaDynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "JournalTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    /**
     * Post data logic
     */
    const postLambda = new lambda.Function(this, "PostDataHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "post-data.handler",
      code: lambda.Code.fromAsset("code"),
      environment: {
        JOURNAL_TABLE: table.tableName,
      },
    });

    table.grantReadWriteData(postLambda);

    let api = new apigw.LambdaRestApi(this, "Journal Endpoint", {
      handler: postLambda,
      proxy: false,
    });

    const postResource = api.root.addResource("add-content");
    postResource.addMethod("POST", new apigw.LambdaIntegration(postLambda));

    /**
     * Get data logic
     */

    const getLambda = new lambda.Function(this, "GetDataHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "get-data.handler",
      code: lambda.Code.fromAsset("code"),
      environment: {
        JOURNAL_TABLE: table.tableName,
      },
    });

    table.grantReadWriteData(getLambda);

    const getResource = api.root.addResource("get-content");
    getResource.addMethod("GET", new apigw.LambdaIntegration(getLambda));

    /**
     * Cloudsearch logic
     */
    const SEARCH_ENDPOINT = "JournalSearchDomain";

    const searchLambda = new lambda.Function(this, "SearchDataHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "search-data.handler",
      code: lambda.Code.fromAsset("code"),
      environment: {
        SEARCH_ENDPOINT: SEARCH_ENDPOINT,
      },
    });

    table.grantReadWriteData(searchLambda);
    const searchResource = api.root.addResource("search-content");
    searchResource.addMethod("GET", new apigw.LambdaIntegration(searchLambda));
  }
}
