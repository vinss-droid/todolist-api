/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const TodosController = () => import('#controllers/todos_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hi: `this is simple api's for todo list!`,
  }
})

router
  .group(() => {
    router.post('login', [AuthController, 'login']).as('auth.login')
    router.post('register', [AuthController, 'register']).as('auth.register')
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.get('/', [TodosController, 'getTodos']).as('todo.index')
    router.post('/', [TodosController, 'createTodos']).as('todo.create')
    router.put('/:id', [TodosController, 'updateTodos']).as('todo.update')
    router.delete('/:id', [TodosController, 'deleteTodo']).as('todo.delete')
  })
  .prefix('todo')
  .as('todo')
