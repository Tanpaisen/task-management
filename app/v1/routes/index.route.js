const taskRoute = require('./task.route')
const userRoute = require('./user.route')


module.exports = (app) => {
    app.use('/api/v1/tasks', taskRoute)

    app.use('/api/v1/users', userRoute)
}