import { FastifyReply, FastifyRequest } from "fastify";
import jwtUtils from "../../../modules/authentication/utils/jwt-utils";
import { knex } from "../../database";


export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return reply.status(401).send({ error: 'Token not provided' });
    }

    const findToken = await knex
      .table('tokens')
      .where({ token })
      .whereNull('revoked_at')
      .first();

    if (!findToken) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    if (findToken.expired_at < new Date()) {
      return reply.status(401).send({ error: 'Token expired' });
    }

    const decoded = jwtUtils.verifyToken(token);

    if (decoded.id !== findToken.user_id) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    request.user = decoded; // Adiciona usuário ao request para uso posterior
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
}

export default requireAuth