import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { TodoItem } from '../models/TodoItem'
// import {parseUserId } from '../auth/utils'

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX ){
  }

  async getAllTodos(userId) {
    console.log('Getting all todos')
    //
    const result = await this.docClient.query({
      TableName : this.todosTable,  
      IndexName : this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()
    return result
  }

  async createTodo(newItem){
    await this.docClient.put({
      TableName: this.todosTable,
      Item: newItem
    }).promise()

    return newItem
  }

  async deleteTodo(todoId){
    var todoItem = {
      TableName: this.todosTable,
      Key:{
          "todoId": todoId,
      }
    }
    await this.docClient.delete(todoItem).promise()
  }

  async updateTodo(updatedTodoItem){
    await this.docClient.update(updatedTodoItem).promise()
  }
}

function createDynamoDBClient() {
    console.log("Creating Todos DynamoDB Client...");
    return new XAWS.DynamoDB.DocumentClient();
   }