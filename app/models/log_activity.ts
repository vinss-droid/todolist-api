import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
// @ts-ignore
import { v4 as uuid } from 'uuid'

export default class LogActivity extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare ipAddress: string

  @column()
  declare device: object

  @column()
  declare path: string

  @column()
  declare method: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @beforeCreate()
  static assignUuid(logActivity: LogActivity) {
    logActivity.id = uuid()
  }
}
