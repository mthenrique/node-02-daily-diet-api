import { FastifyInstance } from "fastify";
import requireAuth from "../../../../../infra/http/middlewares/require-auth";
import MealController from "../controllers/meal-controller";

const mealController = new MealController()

async function mealRoutes(mealRoute: FastifyInstance) {
  mealRoute.post('/', { preHandler: [requireAuth] }, mealController.create)
  mealRoute.put('/:id', { preHandler: [requireAuth] }, mealController.update)
  mealRoute.delete('/:id', { preHandler: [requireAuth] }, mealController.delete)

  mealRoute.get('/', { preHandler: [requireAuth] }, mealController.listMeals)
  mealRoute.get('/:id', { preHandler: [requireAuth] }, mealController.getMeal)
  mealRoute.get('/performance', { preHandler: [requireAuth] }, mealController.getPerformance)
}

export default mealRoutes