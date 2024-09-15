import { knex } from "../../../infra/database"
import { ExceptionError } from "../../../infra/errors/exception-error"

interface ISignOutServiceRequest {
  userId: string
}

class SignOutService {
  public async execute({ userId }: ISignOutServiceRequest): Promise<void> {
    try {
      await knex.table('tokens').update({
        revoked_at: new Date()
      }).where({
        user_id: userId,
      }).whereNull('revoked_at')
    } catch (error) {
      throw new ExceptionError('Error while signing out user', error)
    }
  }
}

export default SignOutService