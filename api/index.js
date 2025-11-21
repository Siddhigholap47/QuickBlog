// api/index.js
import express from 'express'
import cors from 'cors'
import adminRouter from '../server/routes/adminRoutes.js'
import blogRouter from '../server/routes/blogRoutes.js'
import connectDB from '../server/configs/db.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "Server Running on Vercel!" });
});

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

// connect DB once
await connectDB()

export default app
