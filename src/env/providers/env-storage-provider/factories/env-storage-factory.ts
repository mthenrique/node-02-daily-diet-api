import envConfig from '../../../../config/env-config'
import DotenvStorageProvider from '../implementations/dotenv-storage-provider'

const envStorageProvider = {
  dotenv: new DotenvStorageProvider(),
}

class EnvStorageFactory {
  public make() {
    return envStorageProvider[envConfig.storageProvider]
  }
}

export default EnvStorageFactory
