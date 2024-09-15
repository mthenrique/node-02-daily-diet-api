// import { config } from 'dotenv'
// import { IEnvDTO } from './dtos/i-env-dto'

// interface ILoadEnv {
//   test: boolean
// }

// export let env: IEnvDTO

// export async function loadEnvFile({ test }: ILoadEnv) {
//   if (test) {
//     config({ path: '.env.test' })
//   } else {
//     config()
//   }

//   env = await asyncLoadEnv()
// }

// async function asyncLoadEnv(): Promise<IEnvDTO> {
//   const {default: EnvFactory} = await import('./factories/env-factory')
  
//   return new Promise((resolve) => {
//     const envFactory = new EnvFactory()
//     resolve(envFactory.getEnvs())
//   })
// }

import { config } from 'dotenv'
import { z } from 'zod'
import { EnvValidateProviderType } from '../enum/env-validate-provider-type'
import { EnvStorageProviderType } from '../enum/env-storage-provider-type'
import ParametersError from '../infra/errors/parameters-error'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  API_LOGGER: z
    .string()
    .transform((val) => {
      if (val.toLowerCase() === 'true') return true
      if (val.toLowerCase() === 'false') return false
      throw new Error('Invalid boolean value')
    })
    .default('false'),

  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),

  ENV_VALIDATE_PROVIDER: z.nativeEnum(EnvValidateProviderType),
  ENV_STORAGE_PROVIDER: z.nativeEnum(EnvStorageProviderType),

  JWT_SECRET: z.string(),
})

const _envs = envSchema.safeParse(process.env)

if (!_envs.success) {
  throw new ParametersError('[ENV_VALIDATION_ERROR]: ', _envs.error?.format())
}

export const env = _envs.data
