import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {
    console.log(`Usuario ${socket.id} conectado`)

    // bem vindo
    socket.emit('mensagem', "Bem vindo ao chat!")

    // quando um usuário se conecta
    socket.broadcast.emit('mensagem', `Usuario ${socket.id.substring(0, 5)} conectou`)

     
    socket.on('mensagem', data => {
        console.log(data)
        io.emit('mensagem', `${socket.id.substring(0, 5)}: ${data}`)
    })

    // quando um usuário desconecta
    socket.on('desconectado', () => {
        socket.broadcast.emit('mensagem', `Usuario ${socket.id.substring(0, 5)} desconectou`)
    })

    
    socket.on('atividade', (name) => {
        socket.broadcast.emit('atividade', name)
    })
})