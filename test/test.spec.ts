import { app } from '../src/app'
import request from 'supertest'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

describe('All Routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest')
    await app.ready()
  })
  beforeEach(async () => {
    execSync('npm run knex migrate:rollback')
    execSync('npm run knex migrate:latest')
  })
  afterAll(async () => {
    await app.close()
  })
  describe('User Routes', () => {
    it('Should be able to create an user', async () => {
      await request(app.server).post('/users').send({
        name: 'Luciano Abreu',
        email: 'luciano@abreu.com',
        password: '123456',
      })
    })
  })
  describe('Meals Routes', () => {
    it('Should be able to create a meal', async () => {
      await request(app.server).post('/users').send({
        name: 'Luciano Abreu',
        email: 'luciano@abreu.com',
        password: '123456',
      })
      const authenticateUserResponse = await request(app.server)
        .post('/authentication')
        .send({
          email: 'luciano@abreu.com',
          password: '123456',
        })

      const cookies = authenticateUserResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Picanha',
          description: 'Picanha de carne',
          date: '2023-01-01',
          time: '12:00',
          diet: true,
          user_id: cookies,
        })
        .expect(201)
    })

    it('Should be able to list all meals', async () => {
      await request(app.server).post('/users').send({
        name: 'Luciano Abreu',
        email: 'luciano@abreu.com',
        password: '123456',
      })
      const authenticateUserResponse = await request(app.server)
        .post('/authentication')
        .send({
          email: 'luciano@abreu.com',
          password: '123456',
        })

      const cookies = authenticateUserResponse.get('Set-Cookie')
      // sessionId=a1ed56be-20d9-4ea9-a243-ba29cb2a4378;
      console.log('cookie', cookies[0].slice(10, 46))
      await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: 'Picanha',
          description: 'Picanha de carne',
          date: '2023-01-01',
          time: '12:00',
          diet: true,
          user_id: cookies,
        })
        .expect(201)

      const listAllMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      expect(listAllMealsResponse.body.meals).toEqual([
        expect.objectContaining({
          name: 'Picanha',
          description: 'Picanha de carne',
          date: '2023-01-01',
          time: '12:00',
          diet: 1,
          user_id: cookies[0].slice(10, 46),
        }),
      ])
    })
  })
})
