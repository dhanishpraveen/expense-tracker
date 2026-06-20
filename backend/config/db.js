import {neon} from "@neondatabase/serverless"
import "dotenv/config"

export const sql = neon(process.env.NEON_CONNECTION_STRING)

export async function createTransactionTable(){
    try {
        await sql`create table if not exists transaction(
        id serial primary key,
        user_id varchar(255) not null,
        title varchar(255) not null,
        category varchar(255) not null,
        amount decimal(10,2) not null,
        created_at date not null default current_date
        )`

        console.log("Transaction table created successfully")
        
    } catch (error) {
        console.log("Error creating transaction table in database :",error)
        process.exit(1)
    }
}
