import { sql } from "../config/db.js"

export const getTransactionById = async (req,res)=>{
    const {userId} = req.params
    try {
        const response = await sql`select * from transaction where user_id = ${userId} order by created_at desc`
        res.status(200).json({message:"Transaction fetched successfully",data:response})
    } catch (error) {
        console.log("Error fetching transaction",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getTransactionSummary = async (req,res)=>{


    const {userId} = req.params
    try {
        const balanceResult = await sql`select coalesce(sum(amount),0) as balance from transaction where user_id = ${userId}`
        const incomeResult = await sql`select coalesce(sum(amount),0) as income from transaction where user_id = ${userId} and amount>0`
        const expenseResult = await sql`select coalesce(sum(amount),0) as expenses from transaction where user_id = ${userId} and amount<0`
        res.status(200).json({message:"Transaction summary fetched successfully",
                                data:{balance : balanceResult[0].balance,
                                      income : incomeResult[0].income,
                                      expenses : expenseResult[0].expenses}})
    } catch (error) {
        console.log("Error fetching transaction summary",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const createTransaction = async (req,res)=>{
    const {userId,title,category,amount} = req.body
    try {
        if(!userId || !title || !category || amount===undefined){
            res.status(400).json({message:"All fields are required"})
        }
        const response =await sql`
            insert into transaction(user_id,title,category,amount)
            values(${userId},${title},${category},${amount})
            returning * `
        res.status(201).json({message:"Transaction created successfully",data:response[0]})
    } catch (error) {
        console.log("Error creating transaction",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const deleteTransaction = async (req,res)=>{
    const {id} = req.params
    if(isNaN(parseInt(id))){
        res.status(400).json({message: "Invalid transaction ID"})
    }
    try {
        const response = await sql`delete from transaction where id = ${id}`
        res.status(200).json({message:"Transaction deleted successfully"})
    } catch (error) {
        console.log("Error deleting transaction",error)
        res.status(500).json({message:"Internal server error"})
    }
}