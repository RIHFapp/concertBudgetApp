//to do: fixing the styling after the removal of buttons
// using Link (?) for the "back" button
//pairing the shareID and the object from firebase-> check const keyToMyList

import firebase from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "./Loading";

const ViewOnlyList = () => {

//useParams for the view-only list 
const { shareID } = useParams();
// console.log(shareID);

//temporary key to the firebase
const keyToMyList = "-NOgSUGan-4Oi1XOfoRr"

//states
const [nameOfTheList, setNameOfTheList] = useState("Your list");
const [budgetValue, setBudgetValue] = useState("0");
const [listOfConcerts, setListOfConcerts] = useState([]);
const [totalTicketPrice, setTotalTicketPrice] = useState();
const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    const loadPage = async() => {
      await new Promise ((event) => {
        setTimeout(()=> {setPageLoad(false)}, 2000); 
      });
    }
    setTimeout(()=> {
      loadPage();
      setPageLoad(true);
    }, 500);
  }, []);


//function setting the states for displaying the data from the firebase
const checkoutTheData = (name, budget, concerts)=> {
    setNameOfTheList(name);
    setBudgetValue(budget);
    setListOfConcerts(concerts);
}

//function summing up the prices of the tickets
const sumOfPrices = (arrayOfConcerts) => {
    let totalPrice = 0
        for (let price of arrayOfConcerts) {
        totalPrice += price.maxPrice
        }
        return totalPrice
}

//getting the data from Firebase
useEffect( () => {

    const database = getDatabase(firebase);
    const dbRef = ref(database);


    get(dbRef).then((snapshot) => {

        if(snapshot.exists()){
        // We call `.val()` on our snapshot to get the contents of our data. The returned data will be an object that we can  iterate through later
        // console.log(snapshot.val())
        
        //whole object from Firebase
        const allTheLists = snapshot.val();

        //specific data from firebase

        const nameFromList = allTheLists[keyToMyList].listname;
        const budget = allTheLists[keyToMyList].userBudget;
        const allChosenConcerts = allTheLists[keyToMyList].budgetConcertContent;
        
        //taking the data for states
        checkoutTheData(nameFromList, budget, allChosenConcerts);
        
        //taking the data for total price
        setTotalTicketPrice(sumOfPrices(allChosenConcerts))

        } else {
            console.log("No data available")
        }
    }).catch((error) => {
        console.log(error)
    }) 
}, [])  

const priceRanges = [
    { label: 'Concert cost $1000+', minPrice: 1001, maxPrice: Infinity, className: 'listItem3'},
    { label: 'Concert cost below $1000', minPrice: 751, maxPrice: 1000 , className: 'listItem3' },
    { label: 'Concert cost below $750', minPrice: 501, maxPrice: 750, className: 'listItem2' },
    { label: 'Concert cost below $500', minPrice: 251, maxPrice: 500, className: 'listItem1' },
    { label: 'Concert cost below $250', minPrice: 0, maxPrice: 250, className: 'listItem0' },
  ];
  const filteredConcerts = priceRanges.map(({label, minPrice, maxPrice}) => ({
    label,
    concerts: listOfConcerts.filter(concert => concert.maxPrice >= minPrice && concert.maxPrice <= maxPrice)
  }));
  






// const priceRanges = [250, 500, 750, 1000];
        // const priceArrays = priceRanges.map((priceRange) => {
        //     return listOfConcerts.filter((concert) => concert.maxPrice < priceRange).map((concert) => {
        //         return {
        //             name: concert.name,
        //             eventDate: concert.eventDate,
        //             venueCity: concert.venueCity,
        //             venueName: concert.venueName,
        //             maxPrice: concert.maxPrice,
        //             key: concert.key,
        //         };
        //     });
        // });


    return(
        <>
        {pageLoad ? <Loading /> : (
            <>
                    <section className="wrapper viewDetaliedList">     
                        <h2>{nameOfTheList}</h2>
                        <div className="listHeading">
                            <h3>Concert <span id="budgetValue">{totalTicketPrice.toFixed(2)}</span> </h3>
                            <h3>vs</h3>
                            <h3>Budget <span id="totalTicketPrice">{budgetValue}</span></h3>
                        </div>
                        
                        <ul> 
                            <li className="listTags inView">
                                <div className="tagsInView">
                                    <p>Name</p>
                                    <p>Date</p>
                                    <p>City</p>
                                    <p>Location</p>
                                    <p>Price</p>
                                </div>        
                            </li>   
                        </ul>    
                        {filteredConcerts.map(({ label, concerts }) => {
                        if (concerts.length > 0) {
                            return (
                                <div key={label} className={priceRanges.find(range => range.label === label).className}>
                                <h3>{label}</h3>
                                <ul>
                                  {concerts.map(({key, name, eventDate, venueCity, venueName, maxPrice}) => (
                                    <li className="fBListInView" key={key}>
                                      <p>{name}</p>
                                      <p>{eventDate}</p>
                                      <p>{venueCity}</p>
                                      <p>{venueName}</p>
                                      <p>{maxPrice}</p>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                        } else {
                            return null;
                        }
                        })}
                    <Link to={`/listOfLists`}>
                        <button id="LOLButton">back</button>
                    </Link>
                </section>        
            </>
            )}
        </>
    )
}
export default ViewOnlyList;