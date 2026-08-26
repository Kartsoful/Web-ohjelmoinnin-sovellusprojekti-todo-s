import { useState } from "react"
import "./App.css"
function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const addTask = (event) => {
    event.preventDefault()
    const description = task.trim()
    if (!description) return
    setTasks(currentTasks => [...currentTasks, description])
    setTask("")
  }
  const deleteTask = (deleted) => {
    setTasks(currentTasks => currentTasks.filter(item => item !== deleted))
  }
  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={addTask}>
        <input
          placeholder="Add new task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
      </form>
      <ul> 
        { 
        tasks.map(item => ( 
        <li> 
            {item} 
            <button 
            className='delete-button' 
            onClick={() => deleteTask(item)}>
                Delete
            </button>
        </li>
        )) 
        } 
      </ul>
    </div>
  );
}
export default App;
