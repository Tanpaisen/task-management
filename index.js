const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config();

const databaseConfig = require('./config/database')
databaseConfig.connect();

const Task = require('./model/tasks.model')



const port = process.env.PORT

app.get('/', async (req, res) => {
    const tasks = await Task.find({
        deleted: false,
    })
    res.json(tasks)
})

app.get('/detail/:id', async (req, res) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    }).select('id title status content timeStart timeFinish')
    res.json(task)
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})