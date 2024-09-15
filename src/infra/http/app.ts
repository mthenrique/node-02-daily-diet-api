import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from '../../env'

import dietRoutes from './routes/diet-routes'
import globalErrors from './middlewares/global-errors'

export const app = fastify({ logger: env.API_LOGGER })

app.register(cookie)

app.register(dietRoutes)

app.setErrorHandler(globalErrors)
