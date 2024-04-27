import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { createTodoValidator, updateTodoValidator } from '#validators/todo'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Todo from '#models/todo'
import { uuid } from '../helpers/uuid.js'
import { getQueryParams } from '../helpers/http.js'
import User from '#models/user'

@inject()
export default class TodosController {
  async getTodos({ request, response }: HttpContext) {
    const trx = await db.transaction()
    const userId = await getQueryParams('uuid', request.qs())

    if (!userId) {
      return response.forbidden({
        success: false,
        message: 'uuid on query params not found.',
      })
    }

    const userIsReady = await User.query().where('id', userId).first()

    if (!userIsReady) {
      return response.forbidden({
        success: false,
        message: 'User not found',
      })
    }

    try {
      await Todo.query({ client: trx })
        .select('*')
        .from('todos')
        .whereNull('deleted_at')
        .where('user_id', userId)
        .paginate(1, 15)
        .then(async (data) => {
          return response.ok({
            success: true,
            todos: data,
          })
        })
    } catch (error) {
      await trx.rollback()
      return response.status(error?.status || 500).send({
        success: false,
        message: error.message,
        errors: error.messages,
      })
    }
  }

  async createTodos({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await request.validateUsing(createTodoValidator)
      const todos = await request.input('todos')
      const todosWithId = await todos.map((todo: object) => {
        return {
          id: uuid(),
          ...todo,
          created_at: DateTime.utc().toSQLDate(),
          updated_at: DateTime.utc().toSQLDate(),
        }
      })

      await trx
        .insertQuery()
        .table('todos')
        .multiInsert(todosWithId)
        .then(async () => {
          await trx.commit()
          return response.created({
            success: true,
            message: 'Todo created.',
          })
        })
    } catch (error) {
      await trx.rollback()
      return response.status(error?.status || 500).send({
        success: false,
        message: error.message,
        errors: error.messages,
      })
    }
  }

  async updateTodos({ request, response, params }: HttpContext) {
    const trx = await db.transaction()
    try {
      await request.validateUsing(updateTodoValidator)

      const todo = await trx.query().select('*').where('id', params.id).from('todos').first()

      if (!todo) {
        return response.notFound({
          success: false,
          message: 'Todo not found',
        })
      }

      await trx
        .query()
        .where('id', params.id)
        .from('todos')
        .update(request.all())
        .then(async () => {
          await trx.commit()
          return response.ok({
            success: true,
            message: 'Todo updated.',
          })
        })
    } catch (error) {
      await trx.rollback()
      return response.status(error?.status || 500).send({
        success: false,
        message: error.message,
        errors: error.messages,
      })
    }
  }

  async deleteTodo({ request, response, params }: HttpContext) {
    const trx = await db.transaction()
    // @ts-ignore
    const userId: string = await request.header('X-Auth-Uuid')

    try {
      await trx
        .query()
        .where('user_id', userId)
        .where('id', params.id)
        .from('todos')
        .update({
          deletedAt: DateTime.utc().toSQLDate(),
        })
        .then(async () => {
          trx.commit()
          return response.ok({
            success: true,
            message: 'Todo deleted.',
          })
        })
    } catch (error) {
      await trx.rollback()
      return response.status(error?.status || 500).send({
        success: false,
        message: error.message,
        errors: error.messages,
      })
    }
  }
}
