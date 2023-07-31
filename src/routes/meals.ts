import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', checkSessionIdExists)

  app.post('/', async (req, res) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      diet: z.boolean(),
    })

    const { name, description, date, time, diet } = createMealBodySchema.parse(
      req.body,
    )

    const sessionId = req.cookies.sessionId

    const data = {
      id: randomUUID(),
      name,
      description,
      date,
      time,
      diet,
      user_id: sessionId,
    }

    await knex('meals').insert(data)

    return res.status(201).send({ data })
  })

  app.get('/', async (req) => {
    const sessionId = req.cookies.sessionId
    const meals = await knex('meals').where('user_id', sessionId).select()
    return { meals }
  })

  app.get('/:id', async (req) => {
    const getIdMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getIdMealParamsSchema.parse(req.params)
    const sessionId = req.cookies.sessionId
    const meal = await knex('meals').where({ user_id: sessionId, id }).select()
    return { meal }
  })

  app.get('/metrics', async (req, res) => {
    const sessionId = req.cookies.sessionId
    const meals = await knex('meals').where({ user_id: sessionId })
    const metrics = {
      total: meals.length,
      diet: meals.filter((meals) => meals.diet).length,
      notInDiet: meals.filter((meals) => !meals.diet).length,
    }
    return res.status(200).send({
      metrics,
    })
  })

  app.put('/:id', async (req, res) => {
    const getIdMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      diet: z.boolean(),
    })

    const { name, description, date, time, diet } = updateMealBodySchema.parse(
      req.body,
    )
    const { id } = getIdMealParamsSchema.parse(req.params)

    const sessionId = req.cookies.sessionId

    const mealExist = await knex('meals')
      .where({ user_id: sessionId, id })
      .first()

    if (!mealExist) {
      return res.status(404).send()
    }

    const data = {
      name,
      description,
      date,
      time,
      diet,
    }

    await knex('meals').where({ id, user_id: sessionId }).update(data)

    return res.code(200).send({ data })
  })

  app.delete('/:id', async (req, res) => {
    const getIdMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getIdMealParamsSchema.parse(req.params)

    const sessionId = req.cookies.sessionId

    const mealExist = await knex('meals')
      .where({ user_id: sessionId, id })
      .first()

    if (!mealExist) {
      return res.status(404).send()
    }

    await knex('meals').where({ user_id: sessionId, id }).delete()

    return res.status(200).send()
  })
}
