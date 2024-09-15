export class ExceptionError extends Error {
  constructor(message: string, error?: unknown) {
    super(message)
    this.name = 'ExceptionError'

    if (error instanceof Error && this.stack) {
      this.stack = `${this.stack}\n FROM PREVIOUS ERROR: ${error.stack}\n`
    }
  }
}
