import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import zod from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchemaBody = zod.object({
      name: zod.string(),
      email: zod.string().email(),
      password: zod.string(),
    })
    const { name, email, password } = createUserSchemaBody.parse(request.body)

    const userExist = await knex('users').where('email', email).first()

    if (userExist) {
      return reply.status(409).send({ error: 'User already exist' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
    })
    return reply.status(201).send()
  })
}
