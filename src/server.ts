import 'reflect-metadata'
import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { AppDataSource } from './config/dataSource'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import { errorHandler } from './middlewares/errorHandler'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const PORT = Number(process.env.PORT || '3000')

app.use(cors({
  origin: 'http://localhost:8081', // ajuste para a porta do seu frontend
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('API funcionando')
})

app.use(authRoutes)
app.use(userRoutes)
app.use(errorHandler)

// ✅ Conecta no banco ANTES de subir o servidor
AppDataSource.initialize()
  .then(() => {
    console.log('Banco de dados conectado!')
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Falha ao conectar com o banco de dados:', err)
    process.exit(1)
  })