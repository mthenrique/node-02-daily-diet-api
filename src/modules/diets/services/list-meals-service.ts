import { knex } from "../../../infra/database"
import { ExceptionError } from "../../../infra/errors/exception-error"

interface IListMealsRequest {
  userId: string
  filter?: string
  isOnDiet?: boolean
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

interface IListMealsResponse {
  id: string
  name: string
  description: string
  isOnDiet: boolean
  mealDate: Date
}

class ListMealsService {
  public async execute({ 
    userId,
    filter,
    isOnDiet,
    order = 'desc',
    page = 1,
    limit = 10
  }: IListMealsRequest): Promise<IListMealsResponse[]> {
    try {
      const offset = (page - 1) * limit;

    const query = knex
      .table('meals')
      .where({ user_id: userId })
      .whereLike('name', `%${filter}%`)
      .whereNull('deleted_at')
      .orderBy('meal_date', order)
      .limit(limit)
      .offset(offset)
      .select([
        'id',
        'name',
        'description',
        'is_on_diet',
        'meal_date'
      ])

    if (isOnDiet !== undefined) {
      query.where({ is_on_diet: isOnDiet })
    }

    const userMeals = await query

    const meals = userMeals.map(meal => {
      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        isOnDiet: meal.is_on_diet,
        mealDate: new Date(meal.meal_date)
      }
    })

    return meals
    } catch (error) {
      throw new ExceptionError('[LIST_MEALS_ERROR] Could not list user meals', error)
    }
  }
}

export default ListMealsService