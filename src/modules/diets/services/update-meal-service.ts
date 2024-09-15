import { knex } from "../../../infra/database"
import { AppError } from "../../../infra/errors/app-error"
import { MealNotFoundError } from "../infra/errors/meal-not-found-error"

interface IUpdateMealRequest {
  mealId: string
  userId: string
  name: string
  description: string
  isOnDiet: boolean
  mealDate: Date
}

interface IUpdateMealResponse {
  id: string
  name: string
  description: string
  mealDate: Date
  userId: string
  createdAt: Date
}

class UpdateMealService {
  public async execute({ 
    mealId,
    userId,
    name, 
    description,
    isOnDiet, 
    mealDate
  }: IUpdateMealRequest): Promise<IUpdateMealResponse> {
    const meal = await knex.table('meals').first().where({
      id: mealId
    })

    if (!meal) {
      throw new MealNotFoundError()
    }

    if (meal.user_id !== userId) {
      throw new MealNotFoundError()
    }

    const updatedMeal = await knex.table('meals').update({
      name,
      description,
      is_on_diet: isOnDiet,
      meal_date: mealDate
    }).where({
      id: mealId
    })
    .returning(['id', 'name', 'description', 'is_on_diet', 'meal_date', 'user_id', 'created_at'])

    return {
      id: updatedMeal[0].id,
      name: updatedMeal[0].name,
      description: updatedMeal[0].description,
      mealDate: new Date(updatedMeal[0].meal_date),
      userId: updatedMeal[0].user_id,
      createdAt: updatedMeal[0].created_at
    }
  }
}

export default UpdateMealService