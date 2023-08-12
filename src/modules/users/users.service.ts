import { InferModel, eq } from "drizzle-orm";
import { users } from "../../db/schema";
import { db } from "../../db";
import { compare, compareSync, hashSync } from "bcryptjs";
import { logger } from "../../utils/logger";

export async function createUser(data: InferModel<typeof users, "insert">) {

    const hashedPassword = hashSync(data.password, Number(process.env.SECRET))

    const result = await db.insert(users).values({

        ...data,
        password: hashedPassword,

    }).returning({

        id : users.id,
        email : users.email,

    })

    return result[0]

}

export async function getUserFromEmail(email: string){

    const result = await db
        .select({
            id : users.id,
            email : users.email,
            name : users.name,
            password : users.password,
        })
        .from(users)
        .where(
            eq(users.email , email)
        )

    if(!result.length){
        return null
    }

    return result[0]; 

}

export function validatePassword(password: string, hashedPassword: string){

    return compareSync(password, hashedPassword)

}

