// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    tokens: {
      id: string
      user_id: string
      token: string
      created_at: Date
      expired_at: Date
      revoked_at: Date
    }

    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }

    meals: {
      id: string
      user_id: string
      name: string
      description: string
      is_on_diet: boolean
      meal_date: Date
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }
  }
}

// Setup a one time declaration to make knex use number as result type for all
// count and countDistinct invocations (for any table)
declare module 'knex/types/result' {
  interface Registry {
    count: number;
  }
}