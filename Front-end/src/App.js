import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {io} from 'socket.io-client';


function App() {

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get('http://localhost:3002/user');
    setUsers(response.data);
  };

  const addUser = async (e) => {
    e.preventDefault();
    const user ={
      username: e.target.username.value,
      message: e.target.message.value
    }
    await axios.post('http://localhost:3002/user', user)
    .then(() => {
      getUsers();
    });
  };

  const deleteUser = async (id) => {
    console.log(id);
    await axios.delete(`http://localhost:3002/user/${id}`)
    .then(() => {
      getUsers();
    });
  };

  
  useEffect(() => {
    const socket = io('ws://localhost:3002');

    socket.on('connection', () => {
      console.log('connected To server');
    });

    socket.on('order-added', () => {
      getUsers();
    });

    socket.on('disconnect', () => {
      console.log('Disconnected!!!!');
    });
  }, [])

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="App">
      <form onSubmit={addUser}>
        <h1>Send Message</h1>
        <br></br>
        <input id='username' placeholder='username' className='input'/>
        <br></br>
        <br></br>
        <textarea id='message' placeholder='Your Message Here' className='input'/>
        <br></br>
        <br></br>
        <button className='button'>Send</button>
        
      </form>
      {console.log(users)}
      {users && users.map((user) => (
        <div key={user._id} onClick={()=> deleteUser(user._id)} className='chatDiv'> 
          <p>{user.username}: {user.message}</p>
          <button  className='deleteButton'>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
