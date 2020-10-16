import React from 'react';
import io from 'socket.io-client'; //skoro korzystamy z Create React App, to importujemy tę paczkę z node_modules. Create React App korzysta z WebPacka. Możemy ograniczyć się do modułu odpowiedzialnego za możliwości klienta.
const { v4: uuidv4 } = require('uuid');

class App extends React.Component {

  state= {tasks: [ ], taskName: 'cinema' };

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (tasks) => {//przyjmuje zdarzenie od serwera.
      this.setState({tasks: tasks});
    });//Nowy użytkownik włącza aplikację, serwer to wykrywa i wysyła do niego bieżącą listę zadań, żeby miał u siebie aktualny widok.
  }

  removeTask = (id) => { // id = task index.
  this.state.tasks.splice(id, 1); //usunięcie elementu z tablicy o indeksie, którego wartość jest równa właśnie id. 
  this.setState(this.state);
  this.socket.emit('removeTask', id); //info dla serwera. W kliencie nie ma broadcast, bo serwer jest 1 a klientow więcej może być.
  }

  setInputValue(){
    var inputValue = document.getElementById('task-name').value; //wyciągam z inputa value
    this.setState({tasks: this.state.tasks, taskName: inputValue}); //przypisuje nowy stan , taskName będzie tym co wyciagam
  }

  addTask(task){//Jej zadaniem będzie tylko przyjmowanie w formie argumentu stringu z treścią zadania. Nie interesuje jej, czy pochodzi on ze state.taskName, czy może z informacji otrzymanej od serwera. Taka funkcja będzie mogła być używana od razu po wykryciu nowego tasku na serwerze, ale też przez naszą metodę submitForm.
    this.state.tasks.push(task);
    this.setState(this.state);
  }

  submitForm(event){ //submitForm powinna mieć dostęp do obiektu zdarzenia i na samym starcie blokować domyślne zachowanie formularza. 
    event.preventDefault(); //Następnie powinna uruchamiać metodę addTask. Przy wywołaniu tej metody pierwszy argument powinien 
    let newTask = { id: uuidv4(), name: this.state.taskName};
    this.addTask(newTask);// mieć wartość state.taskName, aby funkcja addTask wiedziała jaka ma być treść nowego zadania.
    this.socket.emit('addTask', newTask);
  }

  render() {
    const {state} = this;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {state.tasks.map((task, index) => (//z dokumentacji: var new_array = arr.map(function callback(currentValue, index, array) można szukać index lub nazwać jakkolwiek, a będzie szukać indeksu.
              <li key={task.id} className="task">{task.name}
              <button className="btn btn--red" onClick={() => this.removeTask(index)}>Remove</button>
              </li>
            ))} 
          </ul>
          <form id="add-task-form" name="add-task-form" onSubmit={(event) => this.submitForm(event)}> 
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" 
            value={state.taskName} onChange={() => this.setInputValue()}/>
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };
};

export default App;

//Set the name attribute of your form and your code will work.