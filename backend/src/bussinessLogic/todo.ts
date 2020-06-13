import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import {BucketAccess} from '../dataLayer/bucketAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { parseUserId } from '../auth/utils'
//import {parseUserId} from '../../src/auth/utils'
import { getUserId } from '../lambda/utils'


const todoAccess = new TodoAccess()
const bucketAccess = new BucketAccess()
const todosTable = process.env.TODOS_TABLE

export async function getAllTodos(event) {
  const userId = getUserId(event)
  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(event): Promise<TodoItem> {

  const userId = getUserId(event)
  const todoId = uuid.v4()
  const newTodo: CreateTodoRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const newItem = {
    todoId: todoId,
    userId: userId, // Can be abbreviated to just "userId,"
    done: false,
    ...newTodo
  }

  return await todoAccess.createTodo(newItem)
}

export async function deleteTodo(event){
  const todoId = event.pathParameters.todoId
  return await todoAccess.deleteTodo(todoId)
}

export async function getPresignedUrl(imageId:uuid){
  //const imageId:uuid = uuid.v4()
  console.log("image id in getpresigned url:", imageId)
  const presignedUrl = bucketAccess.getPresignedUrl(imageId)
  console.log("presigned url:", presignedUrl)

  return presignedUrl
}

export async function addAttachment(event,imageId){
  console.log("imageid in add Attachment:", imageId)
  const todoId = event.pathParameters.todoId
  const imageUrl = bucketAccess.getImageUrl(imageId)
  console.log("image url:", imageUrl)
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
  console.log("todo table updated will be:", updatedTodoItem)

  await todoAccess.updateTodo(updatedTodoItem)
  return imageUrl
}

export async function updateTodo(event){
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
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

  await this.todoAccess.updateTodo(updatedItem)
  return updatedItem
}