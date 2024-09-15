import { knex } from "../../../infra/database"
import { ExceptionError } from "../../../infra/errors/exception-error"
import { MealNotFoundError } from "../infra/errors/meal-not-found-error"

interface IGetMealRequest {
  mealId: string
  userId: string
}

interface IGetMealResponse {
  id: string
  name: string
  description: string
  isOnDiet: boolean
  mealDate: Date
}

class GetMealService {

  public async execute({ mealId, userId }: IGetMealRequest): Promise<IGetMealResponse> {
    try {
      const meal = await knex.table('meals').first().where({
        id: mealId
      })
  
      if (!meal) {
        throw new MealNotFoundError()
      }
  
      if (meal.user_id !== userId) {
        throw new MealNotFoundError()
      }
  
      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        isOnDiet: meal.is_on_diet,
        mealDate: new Date(meal.meal_date)
      }
    } catch (error) {
      
      if (error instanceof MealNotFoundError) {
        throw new MealNotFoundError()
      }

      throw new ExceptionError('[GET_MEAL_ERROR] Could not get meal', error)
    }
  }
}

export default GetMealService