import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const defaultUser = {
  id: '',
  nama: ''
}



function FormModal({todo, onCloseModal, onSubmitForm, showModal}) {
  const [show, setShow] = useState(false);
  const [formValue, setFormValue] = useState({})
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
  
    let { data, error } = await supabase
    .from('users')
    .select('*');
  
    setUsers([...data]);
    //console.log(data);
  
  }


  useEffect(()=>{
    fetchUsers()
  },[])


  const handleClose = () => {
    onCloseModal()
    setShow(false);
  }

  useEffect(()=> {
    if(showModal) {
      setShow(true)
      setFormValue(todo)
    } else {
      setShow(false)
    }
  }, [showModal])

  const onChangeInput = (event, key) => {
    const newFormValue = {...formValue}
    newFormValue[key] = event.target.value
    setFormValue(newFormValue)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    onSubmitForm(formValue)
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="text" className="form-label">Text</label>
              <input type="text" className="form-control" id="text" defaultValue={todo?.text} onChange={(e) => onChangeInput(e, 'text')}/>
            </div>
            <div className="mb-3">
              <label htmlFor="points" className="form-label">Points</label>
              <input type="number" className="form-control" id="points" defaultValue={todo?.points} onChange={(e) => onChangeInput(e, 'points')}/>
            </div>
            <div className="mb-3">
              <label htmlFor="user" className="form-label">User</label>
              <select className="form-select" id="user">
                {/* <option value="1">Abu</option>
                <option value="2">Ali</option> */}
                {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
                ))}

              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormModal
