import { pool } from '../helper/db.js'

const insertUser = async (email, hashedPassword) => {
    return await pool.query(
            'INSERT INTO account (email, password) VALUES ($1,$2) RETURNING id, email',
            [email, hashedPassword])
}

const getUser = async (email) => {
    return await pool.query(
            'SELECT id, email, password FROM account WHERE email = $1',
            [email],
    )
}

export { insertUser, getUser }