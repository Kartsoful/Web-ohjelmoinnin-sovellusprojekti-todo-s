import { Router } from 'express'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../helper/db.js'

const { sign } = jwt
const router = Router()

router.post('/signup', async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            const error = new Error('Email and password are required')
            error.status = 400
            return next(error)
        }
        const hashedPassword = await hash(password, 10)
        const result = await pool.query(
            'INSERT INTO account (email, password) VALUES ($1,$2) RETURNING id, email',
            [email, hashedPassword],
        )
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
})

router.post('/signin', async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            const error = new Error('Email and password are required')
            error.status = 400
            return next(error)
        }

        const result = await pool.query(
            'SELECT id, email, password FROM account WHERE email = $1',
            [email],
        )

        const dbUser = result.rows[0]
        if (!dbUser || !(await compare(password, dbUser.password))) {
            const error = new Error('Invalid email or password')
            error.status = 401
            return next(error)
        }

        const token = sign(
            { userId: dbUser.id, email: dbUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
        )

        return res.status(200).json({ id: dbUser.id, email: dbUser.email, token })
    } catch (error) {
        return next(error)
    }
})

export default router