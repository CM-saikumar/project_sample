import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as s3 from "@aws-cdk/aws-s3"

export class LearningStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Dynamodb table definition
    const table = new dynamodb.Table(this, "Hello", {
      partitionKey: { name: "name", type: dynamodb.AttributeType.STRING },
    });

    // lambda function
    const dynamoLambda = new lambda.Function(this, "DynamoLambdaHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("functions"),
      handler: 'batch/export-csv-user-info',
      environment: {
        HELLO_TABLE_NAME: table.tableName,
      },
    });

    // permissions to lambda to dynamo table
    table.grantReadWriteData(dynamoLambda);

    //create s3 bucket
    const logoBucket = new s3.Bucket(this, "programBucket", {
      bucketName: 'csv-files-folder',
      versioned: true
    });


    // create the API Gateway with one method and path
    const api = new apigw.RestApi(this, "hello-api");

    api.root
      .resourceForPath("hello")
      .addMethod("GET", new apigw.LambdaIntegration(dynamoLambda));

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });
  }
}