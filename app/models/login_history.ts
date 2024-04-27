import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LoginHistory extends BaseModel {
  @column()
  declare userId: string

  @column()
  declare ipAddress: string

  @column()
  declare device: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
