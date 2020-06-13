import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const newItem = {
    todoId: todoId,
    userId: userId, // Can be abbreviated to just "userId,"
    done: false,
    ...newTodo
  }

  return await todoAccess.createTodo(newItem)
}