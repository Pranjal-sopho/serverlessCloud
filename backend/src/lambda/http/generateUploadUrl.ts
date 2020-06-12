import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const imageId = uuid.v4()

  console.log("generating presigned url for todoId:",todoId)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const s3 = new AWS.S3({
    signatureVersion: 'v4' 
  })

  const presignedUrl = s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
    Bucket: imagesBucketName, // Name of an S3 bucket
    Key: imageId, // id of an object this URL allows access to
    Expires: '300'  // A URL is only valid for 5 minutes
  })

  console.log("presignedUrl:", presignedUrl)
  // update the corresponding item in todo table
  const imageUrl = `https://${imagesBucketName}.s3.amazonaws.com/${imageId}`

  const updatedTodoItem = {
    TableName: todosTable,
    Key: {
      "todoId": todoId
    },
    UpdateExpression: `set attachmentUrl = :r`,
    ExpressionAttributeValues:{
        ":r":imageUrl
    },
    ReturnValues:"UPDATED_NEW"
  }

  await docClient.update(updatedTodoItem).promise()

  console.log("todo table updated", updatedTodoItem)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        uploadUrl: presignedUrl,
        imageUrl: imageUrl
    })
  }
}
