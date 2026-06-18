const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors');

dotenv.config();

const routeApiVer1 = require('./app/v1/routes/index.route')

const app = express()

const databaseConfig = require('./config/database')
databaseConfig.connect();

const port = process.env.PORT

app.use(cookieParser('tanpaisen'));

//CORS
app.use(cors());

// parse application/json
app.use(bodyParser.json())

//routes version 1
routeApiVer1(app)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})