import { useState,useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormModal from './components/FormModal'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// const initialTodos = [
//   { id: 1, text: 'Learn VSCode', completed: true, points: 2, user: {id: 1, name: 'Abu'} },
//   { id: 2, text: 'Learn Css', completed: true, points: 5, user: {id: 2, name: 'Ali'} },
//   { id: 3, text: 'Learn HTML', completed: true, points: 7, user: {id: 1, name: 'Abu'} },
//   { id: 4, text: 'Learn Bootstrap', completed: true, points: 2, user: {id: 2, name: 'Ali'} },
//   { id: 5, text: 'Learn Git', completed: true, points: 10, user: {id: 1, name: 'Abu'} },
//   { id: 6, text: 'Learn Databse', completed: true, points: 1, user: {id: 1, name: 'Abu'} },
//   { id: 7, text: 'Learn Tailwind', completed: true, points: 3, user: {id: 2, name: 'Ali'} },
//   { id: 8, text: 'Learn SQL', completed: true, points: 6, user: {id: 1, name: 'Abu'} },
// ]

const defaultTodo = {
  id: '',
  text: '',
  points: '',
  user_id: ''
}
// const defaultTodo = {
//   text: '',
//   points: ''
// }


function App() {
  //const [todos, setTodos] = useState(initialTodos)
  const [todos, setTodos] = useState([])
  const [todoEdit, setTodoEdit] = useState(defaultTodo)
  const [showModal, setShowModal] = useState(false)

const fetchToDos = async () => {
  
  // let { data, error } = await supabase
  // .from('todo_items')
  // .select('*');

  // let { data, error } = await supabase
  // .from('todos')
  // .select(`
  //   *,
  //   users (
  //     user_id
  //   )
  // `)

  let { data, error } = await supabase
  .from('todo_items').select(`
  id, 
  text,
  completed,
  points,
  users ( id, name )
`)

  //console.log(data);

  setTodos([...data]);
  //console.log(data);

}

  useEffect(()=>{
    fetchToDos()
  },[])

  const handleToggleCompleted = async (id,completed) => {
   
    const { data, error } = await supabase
    .from('todos')
    .update({'completed': !completed})
    .eq('id', id)
    .select()
    
    fetchToDos()
    // const newTodos = todos.map((todo) => {
    //   if(todo.id === id){
    //     return {...todo, completed: !todo.completed}
    //   }
    //   return todo
    // })
    // setTodos(newTodos)
  }

  const onSubmitForm = async (newTodo) => {
    debugger
    if(newTodo.id){
      //update
      // const { data, error } = await supabase
      // .from('todos')
      // .update(newTodo)
      // .eq('id', newTodo.id)
      // .select()

      // const { data, error } = await supabase
      // .from('todos')
      // .update({ text: newTodo.text ,completed: newTodo.completed ,points: newTodo.points ,user_id: newTodo.user_id })
      // .eq('id', newTodo.id)
      // .select()

      const { data, error } = await supabase
      .from('todos')
      .update({ user_id: newTodo.user_id })
      .eq('id', newTodo.id)
      .select()
      
      console.log(data)

      const newTodos = todos.map((todo) => {
        if(todo.id === newTodo.id){
          return data[0]
        }
        return todo
      })

      setTodos(newTodos)

    }else{
      
      //create
      const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()

      //console.log(data);
      //const newTodos = [...todos, {...newTodo, id: todos.length + 1}]

      setTodos([...todos,data[0]])
    }
  }

  const toggleEdit = (todo) => {
    setTodoEdit(todo)
    setShowModal(true)
  }

  const onCloseModal = () => {
    setTodoEdit(null)
    setShowModal(false)
  }

  const onDelete = async (todo) => {
            
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id)

        // debugger
        
        // const newTodos = todos.map((curTodo) => {
        //   if(curTodo.id === todo.id){
        //     return 
        //   }
        //   return curTodo
        // })
        
        // setTodos(newTodos)

        fetchToDos()
  }

  return (
      <div className="row mt-5 justify-content-center">
        <div className="col-6 align-self-center">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Todo List</h1>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {todos.map((todo) => (
                  <li key={todo.id} className="list-group-item">
                    <div className="row">
                      <div className="col-2">
                        <input type="checkbox" defaultChecked={todo.completed} onChange={() => handleToggleCompleted(todo.id,todo.completed)}/>
                      </div>
                      <div className="col-10">
                        <div>
                          {todo.text}
                          <span className="mx-2 badge bg-primary">{todo.points}</span>
                          <span className="badge bg-secondary">{todo?.users?.name}</span>
                          <span className='mx-2 text-primary' onClick={()=> {toggleEdit(todo)}}>edit</span>
                          <span className='mx-2 text-danger' onClick={()=> {onDelete(todo)}}>delete</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                <div className='btn btn-primary mt-2' onClick={()=> toggleEdit(defaultTodo)}>Add Todo</div>
              </ul>
            </div>
        </div>
      </div>
      <FormModal showModal={showModal} todo={todoEdit} onCloseModal={onCloseModal} onSubmitForm={onSubmitForm}/>
    </div>
  )
}

export default App
