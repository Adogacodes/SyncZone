import 'express-async-errors'
import express      from 'express'
import mongoose     from 'mongoose'
import dotenv       from 'dotenv'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import connectDB    from './config/db.js'
import authRoutes   from './routes/authRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

app.use(cors({
  origin:      'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',    authRoutes)
app.use('/api/members', memberRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'SyncZone API is running' })
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))