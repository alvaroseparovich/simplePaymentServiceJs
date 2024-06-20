import express from 'express'
import { ApiRouter } from '#api/routes'
const app = express()
const router = express.Router()

const port = 8080

router.use((req, res, next) => {
  console.log(`/${req.method}`)
  next()
})

app.use('/', ApiRouter)

app.listen(port, () => {
  console.log('Example app listening on port 8080!')
  console.log(process.env.PORT)
})
