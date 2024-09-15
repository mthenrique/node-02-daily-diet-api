import { knex } from "../../../infra/database"
import { ExceptionError } from "../../../infra/errors/exception-error"
import { MealNotFoundError } from "../infra/errors/meal-not-found-error"

class DeleteMealService {
  public async execute({ mealId, userId }: { mealId: string, userId: string }) {
    try {
      const meal = await knex.table('meals').first().where({
        id: mealId,
        user_id: userId
      })
  
      if (!meal) {
        throw new MealNotFoundError()
      }
  
      await knex.table('meals').update({
        deleted_at: knex.fn.now()
      }).where({
        id: mealId,
        user_id: userId
      })
    } catch (error) {
      if (error instanceof MealNotFoundError) {
        throw new MealNotFoundError()
      }
      
      throw new ExceptionError('[DELETE_MEAL_ERROR] Could not delete meal', error)
    }
  }
}

export default DeleteMealService