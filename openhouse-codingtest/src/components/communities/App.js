import '../styles/App.css';
import { useAsync } from 'react-async';
import {  faExclamationTriangle, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fetchData = async()=> {
    let communities,homes = null;
    communities = await fetch("http://localhost:3333/communities")
    if (!communities.ok) throw new Error(communities.statusText)
    
    homes = await fetch("http://localhost:3333/homes")
    if (!homes.ok) throw new Error(homes.statusText)

    return ({communities:await communities.json(), homes: await homes.json()})
    
}

function currencyFormatter(price){
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return  formatter.format(price);
}

function calculateAvgPrice(homes,commuintyId){
  let totalPrice = 0;
  let totalHouses =0;
  homes.map(home=>{
    if(home.communityId === commuintyId){
      totalPrice+=(home.price);
      totalHouses++;
    }
    return null;
  })
  
  let avgPrice=totalPrice/totalHouses;
  return avgPrice?  currencyFormatter(avgPrice) : 'N/A';
}



function expand(e){

    (document.querySelectorAll('.open-community')).forEach(x=>{
      x.classList.remove("fade-animation")
      if(x !== e.target){

        x.classList.remove("open-community");
        x.querySelector("table").classList.add("hidden");
        x.querySelector("span").classList.remove("hidden");
        x.classList.add("fade-animation");
      }
    })
    
      e.target.querySelector("table").classList.toggle("hidden")
      if(e.target.querySelector("table").innerHTML !== "<tbody></tbody>"){

        e.target.querySelector("span").classList.toggle("hidden")
      }
      e.target.classList.toggle("fade-animation")
      e.target.classList.toggle("open-community")
}

function errorPage(error){
  return(
    <div className="error">
      <FontAwesomeIcon icon={ faExclamationTriangle} />
      <p>{error.message}</p>
    </div>
  );
}

function loadingPage(){
  return(
    <div className="loading">
      <FontAwesomeIcon icon={ faCircleNotch}/>
    </div>
  )
}

function App() {

  const { data, error, isLoading } = useAsync({ promiseFn: fetchData });

  if (isLoading) return loadingPage()
  if (error) return errorPage(error)
  if (data)
  return (
    <div className="App">
      <div className="communities-container">

      {data.communities && data.communities.sort((x,y) => x.name > y.name ? 1 : -1).map(community=> (
        <div key={community.name} className="community" onClick={expand} >
          <div>
            <h1 className="community-name">{community.name}</h1>
            <div className="price">
            <table className="hidden">
              <tbody>
              {data.homes.map(home=>{
                if(home.communityId === community.id){
                  return (
                    
                      <tr key={home.id}>
                        <td>{home.type}: </td>
                        <td> {home.area}sqft </td>
                        <td> {currencyFormatter(home.price)} </td>
                      </tr>
                    
                  )
                }
                return null;
              })}
              </tbody>
            </table>
            <span>  Average Price: {calculateAvgPrice(data.homes,community.id)}</span>
            </div>
          </div>
          <img src={community.imgUrl} alt={community.name} onError={(e)=>{e.target.onerror = null; e.target.src="https://i.picsum.photos/id/114/3264/2448.jpg?hmac=DOmBAsmlq14qncJF_8kOc4zPjtJtVBqmymXphtNHPOA"}} />
            
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
