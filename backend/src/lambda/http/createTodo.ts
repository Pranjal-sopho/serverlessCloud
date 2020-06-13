import 'source-map-support/register'
//import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
//import {parseUserId} from '../../auth/utils'
//import * as AWS  from 'aws-sdk'

//import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createTodo} from '../../bussinessLogic/todo'

//const docClient = new AWS.DynamoDB.DocumentClient()
//const groupsTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const result = await createTodo(event)
  console.log(result)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  }
}
