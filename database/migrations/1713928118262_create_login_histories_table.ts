import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'login_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id')
      table.string('ip_address')
      table.json('device')
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.dropForeign('user_id')
    })
  }
}
