import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function authenticationRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createSessionBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    if (password !== user.password) {
      return res.status(401).send({ error: 'Invalid password' })
    }

    const sessionId = user.id

    const daysInMilliseconds = 1000 * 60 * 60 * 7 // 7 dias

    res.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: daysInMilliseconds,
      expires: new Date(Date.now() + daysInMilliseconds),
    })
  })
}
