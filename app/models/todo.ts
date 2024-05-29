import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 as uuidV4 } from 'uuid'

enum PriorityRules {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

enum StatusRules {
  not_started = 'not_started',
  in_progress = 'in_progress',
  done = 'done',
  archive = 'archive',
}

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare todo: string

  @column()
  declare description: string

  @column()
  declare priority: PriorityRules

  @column()
  declare status: StatusRules

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(todo: Todo) {
    let uuid = uuidV4()
    todo.id = uuid
  }
}
