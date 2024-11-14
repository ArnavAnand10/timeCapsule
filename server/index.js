const express = require('express');
const dbConnection = require('./Database/dbConnection');
const router = require('./Routes/routes');
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(router)
app.listen(3000,()=>{
    console.log('Server started listening on port 3000')
})

dbConnection();