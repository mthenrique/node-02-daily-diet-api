import {hash} from 'bcrypt'
import { knex } from '../../../infra/database'
import { randomUUID } from 'node:crypto'
import { AppError } from '../../../infra/errors/app-error'
import { UserAlreadyExistsError } from '../../../infra/errors/user-already-exists-error'
import { ExceptionError } from '../../../infra/errors/exception-error'

interface ISignUpRequest {
  name: string
  email: string
  password: string
}

interface ISignUpResponse {
  id: string
  name: string
  email: string
}

class SignUpService {
  public async execute({name, email, password}: ISignUpRequest): Promise<ISignUpResponse> {
    try {
      const user = await knex.table('users')
    .where({email})
    .whereNull('deleted_at')
    .first()

    if (user) {
      throw new UserAlreadyExistsError()
    }
    
    const hashedPassword = await hash(password, 10)

    const newUser: ISignUpResponse[] = await knex.table('users').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword
    })
    .returning(['id', 'name', 'email'])

    return newUser[0]
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new UserAlreadyExistsError()
      }

      throw new ExceptionError('[SIGN_UP_ERROR] Could not sign up user', error)
    }
  }
}

export default SignUpService