import { expect, should } from 'chai'

let createdTaskID = null // Added this to save created task ID and delete same after creation

describe('Testing basic database functionality', () => {
    it('should get all tasks', async () => {
        const response = await fetch('http://localhost:3001/tasks')
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys(['id', 'description'])
    })


    it('should create a new task', async () => {
        const newTask = { description: 'Test task' }
        const response = await fetch('http://localhost:3001/tasks', {
            method: 'post',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify ({ task: newTask })
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(['id', 'description'])
        expect(data.description).to.equal(newTask.description)
        createdTaskID = data.id
    })

    it('should delete task', async () => {
        const response = await fetch(`http://localhost:3001/tasks/${createdTaskID}`, {
            method: 'delete'
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys('id')
    })

    it("should not create a new task without description", async () => {
        const response = await fetch("http://localhost:3001/tasks", { 
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: null})
        })
        const data = await response.json()
        expect(response.status).to.equal(400)
        expect(data).to.include.all.keys("error")
    })
})