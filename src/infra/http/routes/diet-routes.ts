import { FastifyInstance } from 'fastify'
import authRoutes from '../../../modules/authentication/infra/http/routes/auth-routes'
import mealRoutes from '../../../modules/diets/infra/http/routes/meal-routes'

export async function dietRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(mealRoutes, { prefix: '/meals' })

  app.get('/', async (_, res) => {
    res.send({ message: 'Daily diet API - V1.0.0' })
  })
}

export default dietRoutes