import { knex } from "../../../infra/database"

interface IGetMealsPerformanceRequest {
  userId: string
}

interface IGetMealsPerformanceResponse {
  amountMeals: number
  amountMealsOnDiet: number
  amountMealsOffDiet: number
  amountBestSequenceOnDiet: number
}

interface IMeal {
  id: string
  isOnDiet: boolean
  mealDate: Date
}

class GetMealsPerformanceService {
  public async execute({ userId }: IGetMealsPerformanceRequest): Promise<IGetMealsPerformanceResponse> {

    const [
      amountMealResult, 
      amountMealOnDietResult, 
      amountMealOffDietResult, 
      mealsResult
    ] = await Promise.all([
      knex
      .table('meals')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .count<Record<string, number>>('id as count')
      .first(),

      knex
      .table('meals')
      .where({ 
        user_id: userId,
        is_on_diet: true
      })
      .whereNull('deleted_at')
      .count<Record<string, number>>('id as count')
      .first(),

      knex
      .table('meals')
      .where({ 
        user_id: userId,
        is_on_diet: false
      })
      .whereNull('deleted_at')
      .count<Record<string, number>>('id as count')
      .first(),

      knex
      .table('meals')
      .where({ 
        user_id: userId,
      })
      .whereNull('deleted_at')
      .orderBy('meal_date', 'asc')
      .select('id', 'is_on_diet as isOnDiet', 'meal_date as mealDate')
    ])

    const amountBestSequenceOnDiet = await this.findBestSequenceOnDiet(mealsResult)

    return {
      amountMeals: amountMealResult?.count ?? 0,
      amountMealsOnDiet: amountMealOnDietResult?.count ?? 0,
      amountMealsOffDiet: amountMealOffDietResult?.count ?? 0,
      amountBestSequenceOnDiet
    }
  }

  private async findBestSequenceOnDiet(allMeals: IMeal[]) {
    let maxSequence = 0;
    let currentSequence = 0;

    for (const meal of allMeals) {
      if (meal.isOnDiet) {
        currentSequence++;
        maxSequence = Math.max(maxSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    }

    return maxSequence;
  }
}

export default GetMealsPerformanceService