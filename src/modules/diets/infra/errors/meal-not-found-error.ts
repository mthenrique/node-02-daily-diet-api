import { AppError } from "../../../../infra/errors/app-error"

export class MealNotFoundError extends AppError {
  constructor() {
    super('Meal not found')

    this.name = 'MealNotFoundError'
  }
}