//importing hooks
import { useState, useEffect } from "react";
import axios from "axios";
import firebase from "../firebase";
import { ref, getDatabase, push } from "firebase/database"; 
import { v4 as uuidv4 } from "uuid";
// import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Loading from "./Loading";
import Swal from 'sweetalert2';



const SearchPage = (/* {pageLoad} */) => {
  // States for User Budget Information
  const [userListName, setUserListName] = useState('');
  const [userBudget, setBudgetInput] = useState('');
  // State for Concert Search
  const [artist, setArtist] = useState(null);
  const [city, setCity] = useState(null);
  const [checked, setChecked ] = useState(false);
  const [apiRes, setApiRes] = useState([]);

  const [addedList, setAddedList] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState (false);
  const [link, setLink] = useState('#');
  const [ticketNumber, setTicketNumber] = useState(0)
  //  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    const loadPage = async() => {
      await new Promise ((event) => {
        console.log(event);
        setTimeout(()=> {setPageLoad(false)}, 2000); 
      });
    }
    setTimeout(()=> {
      loadPage();
      setPageLoad(true);
    }, 2000);
  }, [])

  // Renders user budget information when user clicks 
  const handleListConfig = (event) => {
    event.preventDefault();
    setUserListName(event.target.form[0].value);
    setBudgetInput(event.target.form[1].value);
    
  }

  // Api submit button
  const handleSubmitConcert = (e) => {
    e.preventDefault();
    setArtist(e.target.form[0].value);
    setCity(e.target.form[1].value);
    setChecked(e.target.form[3].checked);
  }

  // On Search Page mount - trigger an API call based on input content availability.
  useEffect (() => {
    if (artist === null && city === null) {
      return;
    } else if (artist === 'undefined' && city === 'undefined') {
      setError(true);
    }
    else {
    setApiLoading(true);
    setError(false);
      axios({
        url: "https://app.ticketmaster.com/discovery/v2/events",
        params: {
          apikey: "15zZnInsCdU0ECUBEtwgFJsPOwjOlGWt",
          keyword: `${artist}`,
          countryCode:"CA",
          city: `${city}`,
          classificationName:"music"
        }
      }).then((res) => {
        const list = res.data._embedded.events.filter((event) => {
          if (checked === false) {
            return event;
          } else if (checked === true && event.priceRanges !== undefined) {
            return event;
          } else {
            return false; // return false if neither condition is true
          }
        });
        setApiRes(list); 
        setTimeout(() => {
          setApiLoading(false);
          new Promise ((newRes) => {
              return newRes;
              })
              .then(() => {
                setApiLoading(true);
              })
              .then(() => {
                setTimeout(() => {
                  setApiLoading(false)
                }, 3000);
              });
        }, 1000)
      }).catch((err)=> {
          setApiLoading(false);
          setError(true);
          setTimeout(() => {
            setError(false);
          }, 2000)
        }
    )}
  },[artist, city, checked])

  // user adds concert to their dynamic list 
  const handleAddConcert = (name, eventDate, venueCity, venueName, maxPrice, concertImg, key) => {
    const concertData = {
      name: name,
      eventDate: eventDate,
      venueCity: venueCity,
      venueName: venueName,
      maxPrice: maxPrice,
      image: concertImg,
      key: key
    }
    setAddedList([...addedList, concertData]);
    setLink(`/listOfLists`);
  }

  //When pressed Submit - the information gets sent to Firebase
  const handleFirebaseConnection = () => {
    if(userBudget === "" && userListName === "" && addedList.length === true) {
      Swal.fire({
        title: 'Empty Named List Sumbited',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Im aware of this , thank you'
      })
    } else if (addedList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add items to your list',
      })
    }
    else if (userBudget === "" && userListName === "") {
      Swal.fire({
        title: 'Empty Named List Sumbited',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Im aware of this , thank you'
      })
    } 
    else {
      // Generate a random key for shearable and editable views
      const shareKey = uuidv4("budget");
      const editKey = uuidv4("edit");
      // Connect to Firebase
      const database = getDatabase(firebase);
      const dbRef = ref(database)
      const keyRef = {
        shareKey,
        editKey,
        listname: userListName,
        userBudget: userBudget,
        budgetConcertContent: addedList,
      };
      push(dbRef, keyRef);

      setLink(`/listOfLists`)
    }
  };

  
  const handleTicketNumIncrease = (ticketNumber) => {
    console.log(ticketNumber);
    if (ticketNumber >= 0 ) {
      ticketNumber = ticketNumber + 1;
      console.log(ticketNumber)
      setTicketNumber(ticketNumber)
    }
  }

  const handleTicketNumDecrease = () => {

  }

  // const handlePageLoadChange = () => {

  // }

    return(
      <>
      {/* Conditionally rendering the page based on loading or error state */}
      {error ? <ErrorPage /> : apiLoading ? <Loading/> : pageLoad ? <Loading /> : (
      // Your component code here
        <>
        <section >
          <div className="inputSection wrapper">
            <h2>Welcome! lets Start planning your concert list</h2>
            <form action="submit">
              {/* name of the list input */}
              <label htmlFor="newName"></label>
              <input
                type="text"
                id="newName"
                placeholder="Name Of Your List" />
              
              {/* user's budget input */}
              <label htmlFor="newBudget"></label>
              <input
                type="text"
                id="newBudget"
                placeholder="Your Budget" />
              <div>
                <button onClick={handleListConfig}>
                  Add List
                </button>
              </div>
            </form>
          </div>
        </section>

        <section>
          <form className="searchForm wrapper">
            <p>Search for concerts by artist and your preferred city</p>
              <label htmlFor="artist"></label>
              <input 
                  className="artistSearch"
                  id="artist"
                  placeholder="Artist..."
              />

              <label htmlFor="city"></label>
              <input 
                  className="citySearch"
                  id="city"
                  placeholder="City..."
              />

              <fieldset>
                <label htmlFor="displayPricedConcerts">
                  Click to show only priced concerts
                </label>
                
                <input
                  id="displayPricedConcerts"
                  className="displayPricedConcerts"
                  name="priceChoice"
                  type ="checkbox"
                  value="priced"
                /> 

              </fieldset>

              <button onClick={handleSubmitConcert}>
                 Search 
              </button>
          </form>
          <div className="searchResultContainer">
              
              <ul className="searchResultList wrapper">
              <h3>Up coming concerts...</h3>
              {!apiLoading && (
                    apiRes.map((concertInfo)=>{
                      const name = concertInfo.name; 
                      const eventDate = concertInfo.dates.start.localDate;
                      const venueCity = concertInfo._embedded.venues[0].city.name;
                      const venueName = concertInfo._embedded.venues[0].name;
                      const maxPrice = concertInfo.priceRanges !== undefined
                        ? concertInfo.priceRanges[0].max
                        : 'To be announced';
                    
                      const concertImg = concertInfo.images[3].url;
                      const key = concertInfo.id;
                      return (
                    
                        <li 
                        key = {key}
                        className="concertResponse wrapper">
                          { 
                            concertInfo.priceRanges !== undefined ? ( 
                              <button
                              onClick = {() => {handleAddConcert(name, eventDate, venueCity, venueName, maxPrice, concertImg, key)}}> + </button>
                             ) : null
                          }
                          <div className="concertListInfo">
                            <span><p> {name} </p></span>
                            <p> {eventDate} </p>
                            <p> {venueCity} </p>
                            <p> {venueName} </p>
                            <span><p>{maxPrice}</p></span>
                          </div>
                          <div className="concertListImage">
                            <img src ={concertImg} alt="concert poster information"></img>
                          </div>
                        </li>
                      )
                  })
                  )}
              </ul>
          </div>
        </section>

        <section>
          <div className="myList wrapper">
            <div className="userBudgetInfo">
              <h2 className="userInput"> List:{userListName} </h2>
              <h2 className="userInput"> Budget:{userBudget} </h2>
            </div>

                <ul className="myConcert wrapper">
                <h3>Selected Concerts</h3>
                  {addedList.map( (list, index) =>{
                    const { name, eventDate, venueCity, venueName, maxPrice, concertImg} = list;
                    return(
                      <li key={index}>
                        <div className="concertListInfo">
                          <span><p>{name}</p></span>
                          <p>{eventDate}</p>
                          <p>{venueCity}</p>
                          <p>{venueName}</p>
                          <span><p>{maxPrice}</p></span>
                        </div>
                        <div className="ticketNumber">
                          <button onClick={handleTicketNumIncrease}>+</button>
                          <p>{ticketNumber}</p>
                          <button onClick={handleTicketNumDecrease}>-</button>
                        </div>
                        <div className="concertListImage">
                          <img src ={concertImg} alt={`Poster of ${name}`} />
                        </div>
                      </li>
                    )
                  })}

                  <Link to={`${link}`}>
                    <button onClick={handleFirebaseConnection}>
                      Submit
                    </button>
                  </Link>
                </ul>
            </div>
        </section>
        </>
      )}
      </>
    )
}

export default SearchPage;

