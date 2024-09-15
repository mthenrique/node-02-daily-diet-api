import EnvStorageFactory from '../providers/env-storage-provider/factories/env-storage-factory'
import EnvValidateFactory from '../providers/env-validate-provider/factories/env-validate-factory'

class EnvFactory {
  public async getEnvs() {
    // Get envs from storage provider
    const envStorageProvider = new EnvStorageFactory().make()
    const _envs = await envStorageProvider.getEnvs()

    // Validate and format envs
    const envValidateProvider = new EnvValidateFactory().make()
    const envs = envValidateProvider.validateAndFormatEnvs(_envs)

    return envs
  }
}

export default EnvFactory
