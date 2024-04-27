import { BaseSchema } from '@adonisjs/lucid/schema'
import {DateTime} from "luxon";

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name')
      table.string('username', 20).unique()
      table.string('password')
      table.timestamp('created_at').defaultTo(DateTime.utc().toSQLDate())
      table.timestamp('updated_at').defaultTo(DateTime.utc().toSQLDate())
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
