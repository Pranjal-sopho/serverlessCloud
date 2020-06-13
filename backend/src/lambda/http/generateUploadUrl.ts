import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {addAttachment, getPresignedUrl} from '../../bussinessLogic/todo'

//const imagesBucketName = process.env.IMAGES_S3_BUCKET
//const docClient = new AWS.DynamoDB.DocumentClient()
//const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  const imageId:uuid = uuid.v4()

  console.log("generating presigned url ")
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const presignedUrl = await getPresignedUrl(imageId)
  //const presignedUrl = returnVal[0]
  //const imageId = returnVal[1]

  //console.log("presignedUrl:", presignedUrl)
  console.log("presigned received in generateuploadurl:",presignedUrl)
  
  const imageUrl = await addAttachment(event, imageId)

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
