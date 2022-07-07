const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.json({
    name: process.env.SERVER
  })
})

app.listen(port, () => {
  console.log(`listening ${process.env.SERVER} on port ${port}`)
})