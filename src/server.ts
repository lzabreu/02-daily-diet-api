import cors from '@fastify/cors'
import { env } from './env'
import { app } from './app'

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server listening on port 3333`)
  })
