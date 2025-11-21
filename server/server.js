import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import adminRouter from './routes/adminRoutes.js'
import blogRouter from './routes/blogRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check route
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Admin routes (protected, all start with /api/admin)
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

// Port configuration
const PORT = process.env.PORT || 3000

// Start server after DB connects
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}

startServer()

// Only needed if this file is imported elsewhere (can be omitted if entry point only)
export default app
