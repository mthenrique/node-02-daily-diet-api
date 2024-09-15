export interface IEnvStorageProvider {
  getEnvs(): Promise<NodeJS.ProcessEnv>
}
