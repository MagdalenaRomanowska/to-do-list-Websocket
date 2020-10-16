const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const socket = require('socket.io'); //uruchamiamy klienta websocketowego. 
const io = socket(server); //Integrujmy z naszym serwerem możliwości oferowane przez paczkę socket.

io.on('connection', (socket) => {//to event, który jest wysyłany automatycznie przez każdy socket w momencie inicjacji połączenia (czyli np. gdy jakiś użytkownik otwiera naszą aplikację listy zadań).
    socket.emit('updateData', tasks); // Jako callback dla tego nasłuchiwacza ustaw funkcję, której zadaniem będzie natychmiastowe emitowanie tylko do tego nowego użytkownika zdarzenia updateData. Wraz z samym zdarzeniem koniecznie wysyłana musi być też sama tablica tasks.
    // czyli: Nowy użytkownik włącza aplikację, serwer od razu to wykrywa i wysyła do niego bieżącą lista zadań, żeby od początku miał u siebie aktualny widok.
    socket.on('addTask', (newTask) => {//po dodaniu elementu do lokalnej listy, należy powiadomić serwer o potrzebie aktualizacji i poinformowania pozostałych klientów.
        tasks.push(newTask);
        socket.broadcast.emit('taskAdded', newTask);//poinformowanie pozostałych klientów.
    });

    socket.on('removeTask', (id) => {//Serwer powinien zaktualizować swoją tablicę oraz ...
        let indexTaskToRemove = tasks.findIndex((x) => x.id ===id );//to, co otrzymasz wraz ze zdarzeniem, jest indeksem elementu do usunięcia. Na bazie tej informacji serwer powinien usunąć ze swojej tablicy element o zgodnym indeksie. 
        tasks.splice(indexTaskToRemove, 1);
        socket.broadcast.emit('taskRemoved', id);//...oraz przesłać informację o potrzebie usunięcia elementu do pozostałych klientów.
    });
});

let tasks = [{ id: uuidv4(), name: 'Shopping'}, { id: uuidv4(), name: 'Go out with a dog'}];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});