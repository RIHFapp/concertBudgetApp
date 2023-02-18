import firebase from "../firebase";
import {ref, getDatabase, onValue} from "firebase/database"; 
import { useState, useEffect } from "react";

const ListOfTheLists = (props) => {

   const [lists, setLists] = useState([]);


   useEffect( () => {

 const database = getDatabase(firebase);
   const dbRef = ref(database);
   onValue(dbRef, (response) => {
      const listsData = response.val();
      const newState = [];
      for (let key in listsData) {
         newState.push(listsData[key]);
      }
      // console.log(newState.object)
      setLists(newState)

   })

   }, [])

      return (
         <>
            <div className="wrapper listOfTheListsContainer">
               <h2> List of created list</h2> 
               <ul> {
                  lists.map((list ,index) => {
                     console.log(list)
                     return (
                        <li key={index}>
                           <p>{list.data}</p>
                        </li>
                     )
                  })
                  }

                  <div className="listContainer">
                     <h3>First Web Developers' paycheck concert list</h3>
                     <p>budget: 1000 CAD </p>
                  </div>
               </ul>
                  <div className="listContainer">
                     <h3>Second Web Developers' paycheck concert list</h3>
                     <p>budget: 1000 CAD </p>
                  </div>
            </div>
            <button id="LOLButton">back</button>
         </>
   )

}

export default ListOfTheLists;