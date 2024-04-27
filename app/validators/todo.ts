import vine from '@vinejs/vine'

export const createTodoValidator = vine.compile(
  vine.object({
    todos: vine.array(
      vine.object({
        // user_id: vine.string().uuid(),
        todo: vine.string(),
        description: vine.string().optional(),
        priority: vine.string().in(['low', 'medium', 'high']),
        status: vine.string().in(['not_started', 'in_progress', 'done', 'archive']),
        date: vine.date(),
      })
    ),
  })
)

export const updateTodoValidator = vine.compile(
  vine.object({
    id: vine.string().uuid(),
    todo: vine.string().optional(),
    description: vine.string().optional(),
    priority: vine.string().in(['low', 'medium', 'high']).optional(),
    status: vine.string().in(['not_started', 'in_progress', 'done', 'archive']).optional(),
    date: vine.date().optional(),
  })
)
