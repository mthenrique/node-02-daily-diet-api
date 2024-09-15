import { compare } from "bcrypt"
import { knex } from "../../../infra/database"
import jwtUtils from "../utils/jwt-utils"
import { randomUUID } from "node:crypto"
import dayjs from "dayjs"
import { ExceptionError } from "../../../infra/errors/exception-error"
import { InvalidUserOrPasswordError } from "../infra/errors/invalid-user-or-password-error"

interface ISignInRequest {
  email: string
  password: string
}

interface ISignInResponse {
  token: string
}

class SignInService {
  public async execute({email, password}: ISignInRequest): Promise<ISignInResponse> {
    try {
      const user = await knex.table('users').where({
        email
      }).first()
  
      if (!user) {
        throw new InvalidUserOrPasswordError()
      }
  
      const isPasswordValid = compare(password, user.password)
  
      if (!isPasswordValid) {
        throw new InvalidUserOrPasswordError()
      }
  
      const {token, expiredAt} = jwtUtils.generateToken({
        id: user.id,
        email: user.email
      })
  
      await knex.table('tokens').update({
        revoked_at: new Date()
      }).where({
        user_id: user.id,
      }).whereNull('revoked_at')
  
      await knex.table('tokens').insert({
        id: randomUUID(),
        user_id: user.id,
        token,
        expired_at: expiredAt
      })
  
      return { 
        token 
      }
    } catch (error) {
      if (error instanceof InvalidUserOrPasswordError) {
        throw new InvalidUserOrPasswordError()
      }

      throw new ExceptionError('[SIGN_IN_ERROR] Could not sign in', error)
    }
  }
}

export default SignInService