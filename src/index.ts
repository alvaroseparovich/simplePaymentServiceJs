import express from "express"
const app = express()
const router = express.Router()

const port = 8080

router.use((req, res, next) => {
  console.log(`/${req.method}`)
  next()
})

router.get("/", (req, res) => {
  res.json({ key: "value" })
})

app.use("/", router)

app.listen(port, () => {
  console.log("Example app listening on port 8080!")
  console.log(process.env.PORT)
})
