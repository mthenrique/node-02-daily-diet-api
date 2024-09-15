import { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../errors/app-error'
import ParametersError from '../../errors/parameters-error'
import { ExceptionError } from '../../errors/exception-error'

function globalErrors(error: Error, _: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(400).send({
      status: 'error',
      message: error.message,
    })
  }

  if (error instanceof ExceptionError) {
    return reply.status(400).send({
      status: 'error',
      message: error.message,
    })
  }

  if (error instanceof ParametersError) {
    return reply.status(400).send({
      status: 'error',
      message: error.message,
      parameters: error.parameters,
    })
  }

  return reply.status(500).send({
    status: 'error',
    message: 'Internal server error',
  })
}

export default globalErrors
