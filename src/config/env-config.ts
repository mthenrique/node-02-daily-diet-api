import { EnvStorageProviderType } from '../enum/env-storage-provider-type'
import { EnvValidateProviderType } from '../enum/env-validate-provider-type'

export interface IEnvConfig {
  validateProvider: EnvValidateProviderType
  storageProvider: EnvStorageProviderType
}

export default {
  validateProvider:
    process.env.ENV_VALIDATE_PROVIDER || EnvValidateProviderType.ZOD,
  storageProvider:
    process.env.ENV_STORAGE_PROVIDER || EnvStorageProviderType.DOTENV,
} as IEnvConfig
