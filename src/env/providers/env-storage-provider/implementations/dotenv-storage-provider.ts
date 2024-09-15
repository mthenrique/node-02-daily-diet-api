import { IEnvStorageProvider } from '../models/i-env-storage-provider'

class DotenvStorageProvider implements IEnvStorageProvider {
  public getEnvs(): Promise<NodeJS.ProcessEnv> {
    return Promise.resolve(process.env)
  }
}

export default DotenvStorageProvider
