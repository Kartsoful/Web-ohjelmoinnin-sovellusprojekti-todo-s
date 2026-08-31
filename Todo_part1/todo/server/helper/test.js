import fs from 'fs/promises'
import path from 'path'
import { pool } from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'


const __dirname = import.meta.dirname

const initializeTestDb = async () => {
    const sql = await fs.readFile(path.resolve(__dirname, '../db.sql'), 'utf8')
    await pool.query(sql)
    const result = await pool.query('SELECT * FROM account')
    console.log('AFTER RESET: ', result.rows)
}

const insertTestUser =  async (user) => {
    const hashedPassword = await hash(user.password, 10)
    await pool.query(
        'INSERT INTO account (email, password) values ($1, $2)',
        [user.email.toLowerCase(), hashedPassword],
    )
}

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}

export { initializeTestDb, insertTestUser, getToken }