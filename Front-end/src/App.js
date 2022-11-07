import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get('https://localhost:3002/');
    setUsers(response.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="App">
      <div>
        <h1>Send Message</h1>
        <br></br>
        <input placeholder='username' className='input'/>
        <br></br>
        <br></br>
        <textarea placeholder='Your Message Here' className='input'/>
        <br></br>
        <br></br>
        <button className='button'>Send</button>
      </div>
      {console.log(users)}
      {users && users.map((user) => (
        <div> 
          <p>{user.username}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
