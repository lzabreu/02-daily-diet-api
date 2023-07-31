import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { authenticationRoutes } from './routes/authentication'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(authenticationRoutes, {
  prefix: 'authentication',
})
