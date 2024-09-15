import z from 'zod'
import ParametersError from '../../../../infra/errors/parameters-error'
import { IEnvValidateProvider } from '../models/i-env-validate-provider'
import { IEnvDTO } from '../../../dtos/i-env-dto'
import { EnvValidateProviderType } from '../../../../enum/env-validate-provider-type'
import { EnvStorageProviderType } from '../../../../enum/env-storage-provider-type'

class ZodEnvValidateProvider implements IEnvValidateProvider {
  public validateAndFormatEnvs(envs: NodeJS.ProcessEnv): IEnvDTO {
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

    const _envs = envSchema.safeParse(envs)

    if (!_envs.success) {
      throw new ParametersError(
        '[ENV_VALIDATION_ERROR]: ',
        _envs.error?.format(),
      )
    }

    return _envs.data
  }
}

export default ZodEnvValidateProvider
