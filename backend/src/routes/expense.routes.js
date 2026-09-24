import { Router } from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getCategories,
} from "../controllers/expense.controllers.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

// All expense routes are protected
router.use(verifyJwt);

router.get("/categories", getCategories);
router.get("/summary", getExpenseSummary);
router.route("/").get(getExpenses).post(createExpense);
router
  .route("/:id")
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;