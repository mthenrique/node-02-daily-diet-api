import { z } from "zod"
import ParametersError from "../../../../../infra/errors/parameters-error"
import CreateMealService from "../../../services/create-meal-service"
import UpdateMealService from "../../../services/update-meal-service"
import DeleteMealService from "../../../services/delete-meal-service"
import ListMealsService from "../../../services/list-meals-service"
import GetMealService from "../../../services/get-meal-service"
import GetMealsPerformanceService from "../../../services/get-meals-performance-service"

class MealController {

  async create(request: any, reply: any) {
    const { id } = request.user

    const createBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      mealDate: z.coerce.date(),
      isOnDiet: z.boolean(),
    })

    const body = createBodySchema.safeParse(request.body)

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const { name, description, isOnDiet, mealDate } = body.data

    const createMealService = new CreateMealService()

    const meal = await createMealService.execute({ 
      userId: id,
      name, 
      description,
      isOnDiet, 
      mealDate
    })

    return reply.status(201).send(meal)
  }

  async update(request: any, reply: any) {
    const { id: userId } = request.user
    const { id: mealId } = request.params

    if (!mealId) {
      throw new ParametersError('[PARAMETERS_ERROR] Missing meal id')
    }

    const updateBodySchema = z.object({
      mealId: z.string().uuid(),
      userId: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      mealDate: z.coerce.date(),
    })

    const body = updateBodySchema.safeParse({...request.body, userId, mealId})

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const { name, description, isOnDiet, mealDate } = body.data

    const updateMealService = new UpdateMealService()

    const meal = await updateMealService.execute({ 
      mealId,
      userId,
      name, 
      description,
      isOnDiet, 
      mealDate
    })

    return reply.status(200).send(meal)
  }

  async delete(request: any, reply: any) {
    const { id: userId } = request.user
    const { id: mealId } = request.params

    const deleteBodySchema = z.object({
      mealId: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const body = deleteBodySchema.safeParse({
      mealId,
      userId
    })

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const deleteMealService = new DeleteMealService()

    await deleteMealService.execute({ mealId, userId })

    return reply.status(204).send()
  }

  async listMeals(request: any, reply: any) {
    const { id: userId } = request.user

    // Função para converter string em boolean
    const stringToBoolean = (value: string | undefined): boolean | undefined => {
      if (value === undefined) return undefined;
      return value.toLowerCase() === 'true';
    };

    const listBodySchema = z.object({
      userId: z.string().uuid(),
      filter: z.string().optional(),
      isOnDiet: z.union([
        z.boolean(),
        z.string().optional().transform(stringToBoolean),
      ]).optional(),
      order: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().min(1).optional(),
      limit: z.coerce.number().min(1).optional()
    })

    const body = listBodySchema.safeParse({...request.query, userId})

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const { filter, isOnDiet, order, page, limit } = body.data

    const listMealsService = new ListMealsService()

    const meals = await listMealsService.execute({
      userId,
      filter,
      isOnDiet,
      order,
      page,
      limit
    })

    return reply.status(200).send(meals)
  }

  async getMeal(request: any, reply: any) {
    const { id: userId } = request.user
    const { id: mealId } = request.params

    const getMealBodySchema = z.object({
      mealId: z.string().uuid(),
      userId: z.string().uuid(),
    })

    const body = getMealBodySchema.safeParse({
      mealId,
      userId
    })

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const getMealService = new GetMealService()

    const meal = await getMealService.execute({ mealId, userId })

    return reply.status(200).send(meal)
  }

  async getPerformance (request: any, reply: any) {
    const getPerformanceBodySchema = z.object({
      userId: z.string().uuid(),
    })

    const body = getPerformanceBodySchema.safeParse({ userId: request.user.id })

    if (!body.success) {
      throw new ParametersError(
        '[PARAMETERS_ERROR] Invalid parameters',
        body.error.format(),
      )
    }

    const { userId } = body.data

    const getMealsPerformanceService = new GetMealsPerformanceService()

    const performance = await getMealsPerformanceService.execute({ userId })

    return reply.status(200).send(performance)
  }
}

export default MealController