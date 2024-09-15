import { FastifyReply, FastifyRequest } from "fastify";
import SignInService from "../../../services/sign-in-service";
import SignUpService from "../../../services/sign-up-service";
import { z } from "zod";
import ParametersError from "../../../../../infra/errors/parameters-error";
import SignOutService from "../../../services/sign-out-service";

class AuthController {
  async signIn(request: FastifyRequest, reply: FastifyReply) {
    const signInBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const body = signInBodySchema.safeParse(request.body)

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error,
      )
    }

    const { email, password } = body.data

    const signInService = new SignInService()

    const { token } = await signInService.execute({
      email, 
      password
    })

    return reply.send({ token })
  }

  async signUp(request: FastifyRequest, reply: FastifyReply) {
    const signUpBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const body = signUpBodySchema.safeParse(request.body)

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error,
      )
    }

    const { name, email, password } = body.data

    const signUpService = new SignUpService()

    const user = await signUpService.execute({
      name,
      email, 
      password})

    return reply.status(201).send({ user })
  }

  async signOut(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    const signOutService = new SignOutService()

    await signOutService.execute({ userId: user.id })
    return reply.send()
  }
}

export default AuthController