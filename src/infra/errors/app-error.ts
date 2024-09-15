export class AppError extends Error {
  constructor(message: string, error?: unknown) {
    super(message)
    this.name = 'AppError'

    if (error instanceof Error && this.stack) {
      this.stack = `${this.stack}\n FROM PREVIOUS ERROR: ${error.stack}\n`
    }
  }
}
