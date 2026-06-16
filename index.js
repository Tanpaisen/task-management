const express = require('express')

const dotenv = require('dotenv')

dotenv.config();

const routeApiVer1 = require('./app/v1/routes/index.route')

const app = express()

const databaseConfig = require('./config/database')
databaseConfig.connect();

const port = process.env.PORT

//routes version 1
routeApiVer1(app)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})