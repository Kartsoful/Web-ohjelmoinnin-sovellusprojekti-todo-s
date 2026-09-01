import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { insertUser, getUser } from "../models/User.js";
import { ApiError } from "../helper/ApiError.js";

const { sign } = jwt

const signUp = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            return next(new ApiError('Email and password are required', 400))
        }
        const hashedPassword = await hash(password, 10)
        const result = await insertUser(email, hashedPassword)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
        const email = req.body.user?.email?.trim().toLowerCase()
        const password = req.body.user?.password
        if (!email || !password) {
            const error = new Error('Email and password are required')
            error.status = 400
            return next(error)
        }

        const result = await getUser(email)

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
}

export { signUp, signIn }