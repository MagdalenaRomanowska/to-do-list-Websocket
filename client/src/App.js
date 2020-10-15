import React from 'react';
import io from 'socket.io-client'; //skoro korzystamy z Create React App, to importujemy tę paczkę z node_modules. Create React App korzysta z WebPacka. Możemy ograniczyć się do modułu odpowiedzialnego za możliwości klienta.

class App extends React.Component {

  state= {tasks: [ ], taskName: 'cinema' };

  removeTask = (id) => { // id = task index.
  this.state.tasks.splice(id, 1); //usunięcie elementu z tablicy o indeksie, którego wartość jest równa właśnie id. 
  this.setState(this.state);
  this.socket.emit('removeTask', id); //info dla serwera. W kliencie nie ma broadcast, bo serwer jest 1 a klientow więcej może być.
  }

  setInputValue(){
    var inputValue = document.getElementById('task-name').value; //wyciągam z inputa value
    this.setState({tasks: this.state.tasks, taskName: inputValue}); //przypisuje nowy stan , taskName będzie tym co wyciagam
    console.log('this.state', this.state);
  }

  submitForm(){
  const form = document.getElementById('form');
const log = document.getElementById('log');
form.addEventListener('submit', logSubmit);
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (tasks) => {//przyjmuje zdarzenie od serwera.
      this.setState({tasks: tasks});
    });//Nowy użytkownik włącza aplikację, serwer od razu to wykrywa i wysyła do niego bieżącą lista zadań, żeby od początku miał u siebie aktualny widok.
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
              <li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => this.removeTask(index)}>Remove</button></li>
            ))} 
          </ul>
          <form id="add-task-form" name="add-task-form"> 
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