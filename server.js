const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const socket = require('socket.io'); //uruchamiamy klienta websocketowego. 
const io = socket(server); //Integrujmy z naszym serwerem możliwości oferowane przez paczkę socket.

io.on('connection', (socket) => {
    socket.emit('updateData', tasks); // Jako callback dla tego nasłuchiwacza ustaw funkcję, której zadaniem będzie natychmiastowe emitowanie tylko do tego nowego użytkownika zdarzenia updateData. Wraz z samym zdarzeniem koniecznie wysyłana musi być też sama tablica tasks.
    console.log('New task! Its id – ' + socket.id);
    
    socket.on('addTask', (task) => {
        let newTask = { name: task.name };
        tasks.push(newTask);
        socket.broadcast.emit('addTask', newTask);
    });

    socket.on('removeTask', (index) => {
        tasks.splice(index, 1);
        socket.broadcast.emit('updateData', tasks);
    });

});

let tasks = [{ id: uuidv4(), name: 'Shopping'}, { id: uuidv4(), name: 'Go out with a dog'}];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});