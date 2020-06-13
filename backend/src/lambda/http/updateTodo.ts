import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {updateTodo} from '../../bussinessLogic/todo'

//const docClient = new AWS.DynamoDB.DocumentClient()
//const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  console.log("updating todo item...")
  await updateTodo(event)
  return undefined
}
