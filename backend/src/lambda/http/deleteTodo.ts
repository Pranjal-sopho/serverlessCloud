import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import {deleteTodo} from '../../bussinessLogic/todo'

//const docClient = new AWS.DynamoDB.DocumentClient()
//const todosTable = process.env.TODOS_TABLE

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  try{
    await deleteTodo(event)
    return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
  } catch(err){
    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: ''
          }
      }
}

