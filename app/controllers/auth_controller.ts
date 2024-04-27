import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import { uuid } from '../helpers/uuid.js'
import User from '#models/user'

@inject()
export default class AuthController {
  async login({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await request.validateUsing(loginValidator)

      const user = await User.query({ client: trx })
        .select('*')
        .where('username', request.input('username'))
        .from('users')
        .first()

      if (!user) {
        return response.abort({
          success: false,
          message: 'Invalid credentials',
        })
      }

      await hash
        .verify(user.password, request.input('password'))
        .then(async (success) => {
          if (success) {
            return response.ok({
              success: true,
              message: 'Login success.',
              data: {
                uuid: user.id,
              },
            })
          } else {
            return response.abort({
              success: false,
              message: 'Invalid credentials',
            })
          }
        })
        .catch(async (error) => {
          await trx.rollback()
          return response.status(error?.status || 500).send({
            success: false,
            message: error.message,
            errors: error.messages,
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

  async register({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      await request.validateUsing(registerValidator)

      await trx
        .insertQuery()
        .table('users')
        .insert({
          id: uuid(),
          name: request.input('name'),
          username: request.input('username'),
          password: await hash.make(request.input('password')),
        })
        .then(async () => {
          await trx.commit()
          return response.created({
            success: true,
            message: 'Register success.',
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
