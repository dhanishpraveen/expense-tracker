import express from "express"
import { sql } from "../config/db.js"
import { createTransaction, deleteTransaction, getTransactionById, getTransactionSummary } from "../controllers/transactionController.js"

const router = express.Router()

router.get('/:userId', getTransactionById)
router.get('/summary/:userId', getTransactionSummary)
router.post('/', createTransaction)
router.delete('/:id', deleteTransaction)

export default router