import { EnvStorageProviderType } from '../../enum/env-storage-provider-type'
import { EnvValidateProviderType } from '../../enum/env-validate-provider-type'

export interface IEnvDTO {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  API_LOGGER: boolean

  DATABASE_CLIENT: 'sqlite' | 'pg'
  DATABASE_URL: string

  ENV_VALIDATE_PROVIDER: EnvValidateProviderType
  ENV_STORAGE_PROVIDER: EnvStorageProviderType

  JWT_SECRET: string
}
