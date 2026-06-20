import express from 'express'
import "dotenv/config"
import { createTransactionTable, sql } from './config/db.js'
import transactionRoute from './routes/transactionRoutes.js'

const app = express()
const PORT = process.env.PORT


app.use(express.json())
app.use('/api/transactions',transactionRoute)

createTransactionTable()
.then(
    app.listen(PORT,
        console.log("Server listening on port : " ,PORT)
    ))