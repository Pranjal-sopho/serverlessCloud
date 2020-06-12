import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const updatedItem = {
    TableName: todosTable,
    Key: {
      "todoId": todoId
    },
    UpdateExpression: `set ${todosTable}.name = :r, ${todosTable}.dueDate=:p, ${todosTable}.done=:a`,
    ExpressionAttributeValues:{
        ":r":updatedTodo.name,
        ":p":updatedTodo.dueDate,
        ":a":updatedTodo.done
    },
    ReturnValues:"UPDATED_NEW"
  }

  await docClient.update(updatedItem, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  }).promise();
  
  return undefined
}
