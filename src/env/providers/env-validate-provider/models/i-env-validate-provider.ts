import { IEnvDTO } from '../../../dtos/i-env-dto'

export interface IEnvValidateProvider {
  validateAndFormatEnvs(envs: NodeJS.ProcessEnv): IEnvDTO
}
