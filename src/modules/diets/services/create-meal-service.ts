import { randomUUID } from "node:crypto"
import { ExceptionError } from "../../../infra/errors/exception-error"
import { knex } from "../../../infra/database"
import { AppError } from "../../../infra/errors/app-error"

interface ICreateMealRequest {
  userId: string
  name: string
  description: string
  isOnDiet: boolean
  mealDate: Date
}

interface ICreateMealResponse {
  id: string
  name: string
  description: string
  mealDate: Date
  userId: string
  createdAt: Date
}

class CreateMealService {

  public async execute({ 
    userId,
    name, 
    description, 
    isOnDiet, 
    mealDate 
  }: ICreateMealRequest): Promise<ICreateMealResponse> {
    try {
      const meal = await knex('meals').insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        is_on_diet: isOnDiet,
        meal_date: mealDate,
      })
      .returning(['id', 'name', 'description', 'is_on_diet', 'meal_date', 'user_id', 'created_at'])

      return {
        id: meal[0].id,
        userId: meal[0].user_id,
        name: meal[0].name,
        description: meal[0].description,
        mealDate: new Date(meal[0].meal_date),
        createdAt: meal[0].created_at
      }
    } catch (error) {
      throw new ExceptionError('[CREATE_MEAL_ERROR] Could not create meal', error)
    }
  }
}

export default CreateMealService