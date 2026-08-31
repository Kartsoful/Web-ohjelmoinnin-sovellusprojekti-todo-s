import { selectAllTasks, insertTask } from '../models/Task.js'

const getTasks = async (req, res,next) => {
    try { 
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next(error)
    }
}

const createTask = async (req, res, next) => {
    try {
        const description = req.body.task?.description?.trim()
        if (!description) {
            const error = new Error('Task description is required')
            error.status = 400
            return next(error)
        }
        const result = await insertTask(description)
        return res.status(201).json(result.rows[0])
    } catch (error) {
        return next(error)
    }
}

/*
const deleteTask = async (req, res, next) => {
    try {
        if 
    }
}
*/

export { getTasks, createTask }