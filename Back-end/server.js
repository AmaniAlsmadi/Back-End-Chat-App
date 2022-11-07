'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amani:oQV23JUJduPVMqHM@cluster0.2dg17x6.mongodb.net/?retryWrites=true&w=majority';
const user = require('./schema.js');
const socketIO = require('socket.io');
const http = require('http');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE'],
    }
})

app.get('/', async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);

    } catch (error) {
        res.send(error.message);
    }
});
app.post('/', async (req, res) => {
    try {
        const newUser = new user(req.body);
        await newUser.save();
        const users = await user.find();
        io.emit('users added', users);
        res.status(200).json(newUser);
    } catch (error) {
        res.send(error.message);
    }
});
app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await user.findByIdAndDelete(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.send(error.message);
    }
});

io.on('connection', (socket) => {
    socket.on('newUser', (users) => {
        console.log(`new user ${users.username} : ${socket.id}`);
    });
    socket.on('send message', (message) => {
        console.log(message);
    });

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
    });
});

app.listen(PORT, () =>
    console.log(`Listening on port: ${PORT}`));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('MongoDB is Connected');
});