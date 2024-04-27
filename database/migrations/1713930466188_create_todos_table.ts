import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id')
      table.string('todo')
      table.text('description').nullable()
      table.enum('priority', ['low', 'medium', 'high']).checkIn(['low', 'medium', 'high'])
      table
        .enum('status', ['not_started', 'in_progress', 'done', 'archive'])
        .checkIn(['not_started', 'in_progress', 'done', 'archive'])
      table.date('date')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary('id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.dropForeign('user_id')
    })
  }
}
