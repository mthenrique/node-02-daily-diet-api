import { env } from '../../env'

const main = async () => {
  // await loadEnvFile({ test: false })

  const { app } = await import('./app')

  app
    .listen({
      port: env.PORT,
    })
    .then(() => {
      console.log(`server is running on port ${env.PORT}`)
    })
}

main()
