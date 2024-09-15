import { AppError } from "../../../../infra/errors/app-error"

export class InvalidUserOrPasswordError extends AppError {
  constructor() {
    super('Invalid user or password')

    this.name = 'InvalidUserOrPasswordError'
  }
}