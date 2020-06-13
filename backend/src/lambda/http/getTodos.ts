import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { parseUserId } from '../../auth/utils'
import {getAllTodos} from '../../bussinessLogic/todo'

//const docClient = new AWS.DynamoDB.DocumentClient()
//const todosTable = process.env.TODOS_TABLE
//const userIdIndex = process.env.USER_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  //console.log("fetching all todos for user:", userId)
  const result = await getAllTodos(event)
  console.log("fetched todos:",result)
  if (result) {
    /*
    if(result.Items.length===0){
      var dummy = {
        'todoId': "dummyId",
        'userId': userId
      }
      result.Items.push([dummy])
    } */
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items)
    }
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
