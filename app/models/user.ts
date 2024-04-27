import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasOne } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import LoginHistory from '#models/login_history'
import Todo from '#models/todo'
import { uuid } from '../helpers/uuid.js'

export default class User extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = uuid()
  }

  @hasOne(() => LoginHistory)
  declare loginHistory: relations.HasOne<typeof LoginHistory>

  @hasOne(() => Todo)
  declare todo: relations.HasOne<typeof Todo>
}
