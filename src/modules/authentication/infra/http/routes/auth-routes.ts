import { FastifyInstance } from 'fastify'
import AuthController from '../controllers/auth-controller'
import { requireAuth } from '../../../../../infra/http/middlewares/require-auth'

const authController = new AuthController()

async function authRoutes(authRoute: FastifyInstance) {
  authRoute.post('/sign-in', authController.signIn)
  authRoute.post('/sign-up', authController.signUp)

  // Rota protegida
  authRoute.post('/sign-out', { preHandler: [requireAuth] }, authController.signOut);
}

export default authRoutes