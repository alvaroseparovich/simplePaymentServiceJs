import { Router } from 'express'
import { customerValidation } from '../validation'
const router = Router()

router.use((req, res, next) => {
  console.log(`/${req.method}`)
  next()
})

router.get('/customer', (req, res) => {
  res.json({ key: 'value' })
})
router.post('/customer', (req, res) => {
  const bodyParsed = customerValidation.parse(req.body)
  res.json({ key: 'value' })
})

router.post('/transfer', (req, res) => {
  res.json({ key: 'value' })
})

export const ApiRouter = router
