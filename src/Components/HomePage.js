import { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import firebase from "../firebase";

const Homepage = ({name}) => {
  const [userListName, setUserListName] = useState('')
  const handleInput = (event) => {
    setUserListName(event.target.value);
  }
  const handleSubmit = (event) => {
    //get the info from userinput STATE
    event.preventDefault();
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    push(dbRef, userListName);
    setUserListName('');  
  }
  
  
    return(
      <div>
        <h1>Budget vs Concert</h1>
        <h2>Welcome! lets Start planning your conecert list</h2>
      <form action="submit">
        <label htmlFor="newName"></label>
        <input 
        onChange={handleInput} type="text" id="newName" value={userListName} placeholder="name of your list" />
        <label htmlFor=""></label>
        <input 
         type="text" id="newName" placeholder="your budget" />
        <button onClick={handleSubmit}>Add List</button>
      </form>
      {/* <ul>
        {name.map ( (name) => {
          return (
            <li key={name.key}>
              <p>{name.name}</p>
              <button >
              remove!
              </button>
            </li>
          )

        })}
      </ul> */}
      </div>
    )
    
}

export default Homepage;