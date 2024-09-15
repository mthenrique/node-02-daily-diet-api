import envConfig from '../../../../config/env-config'
import ZodEnvValidateProvider from '../implementations/zod-env-validate-provider'

const envValidateProvider = {
  zod: new ZodEnvValidateProvider(),
}

class EnvValidateFactory {
  public make() {
    return envValidateProvider[envConfig.validateProvider]
  }
}
export default EnvValidateFactory
