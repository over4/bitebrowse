import React,{useEffect, useState} from "react"
import Footer from "./components/Footer";
import SearchArea from "./components/SearchArea";
import Card from "./components/Cards";
import BackButton from "./components/BackButton";
import PopUp from "./components/PopUp";
import AddButton from "./components/AddButton";
import AddArea from "./components/AddArea";
import bannerImage from './food-banner-3.jpg';




function App() {
  const [recipeList,setRecipeList] = useState([])
  const [isDoneStart,setIsDoneStart] = useState(false)
  const [isDoneSearch,setIsDoneSearch]= useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showAddArea, setShowAddArea] = useState(false);

  useEffect(() => {
    randomRecipes()
  }, []);

  async function handleSearch(searchTerm){
    try{
    //console.log("search?cuisine=" + searchTerm.cuisine + "&prepTime=" + searchTerm.prep + "&ingredient=" + searchTerm.ingredients);
    const response = await fetch("/search?cuisine=" +searchTerm.cuisine + "&prepTime=" + searchTerm.prep + "&ingredient=" + searchTerm.ingredients)
    let data = await response.json()
    if(data == [] || data == '' || !data){
      //nothing returned from search
      setPopupMessage("Can't find anything with that search. Please Try again!");
      setShowPopup(true);
      randomRecipes()
      return
    }
    setRecipeList(data)
    setIsDoneStart(false)
    setIsDoneSearch(true)
    }catch(error){
      setPopupMessage("Can't find anything with that search. Please Try again!");
      setShowPopup(true);
      randomRecipes()
      return
    }
  }
  async function randomRecipes(){
    try{
    const response = await fetch("/random")
    let data = await response.json()
    setRecipeList(data)
    setIsDoneStart(true)
    setIsDoneSearch(false)
    setShowAddArea(false)
    }catch(error){

    }
  }
  function goBack(){
    setRecipeList([])
    randomRecipes()
    setIsDoneStart(true)
    setIsDoneSearch(false)
    setShowAddArea(false)
  }
  function handleAdd(){
    setIsDoneStart(false)
    setIsDoneSearch(false)
    setShowAddArea(true)
  }
    //   
  return (
    <div className="container">
      <div className = "banner-area" style={{ backgroundImage: `url(${bannerImage})` }} >
        <BackButton
        back = {goBack}
        />
        <SearchArea
            submit={handleSearch}
        />
        <AddButton
            add = {handleAdd}
        />
      </div>
      <PopUp
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />
        <div className = "content">
          {isDoneStart && recipeList.map((item,index)=>{ 
            return (
            <Card
              key = {index}
              title= {item.title}
              cuisine= {item.cuisine}
              prepTime = {item.preptime}
              rating = {item.rating}
              ingredients={item.ingredients}
              spices =  {item.spices}
              steps ={item.steps}
              thumbnailUrl={item.thumbnailurl}
              />)
          })}
          {isDoneSearch && recipeList.map((item,index)=>{ 
            return (
            <Card
              key = {index}
              title= {item.title}
              cuisine= {item.cuisine}
              prepTime = {item.preptime}
              rating = {item.rating}
              ingredients={item.ingredients}
              spices =  {item.spices}
              steps ={item.steps}
              thumbnailUrl={item.thumbnailurl}
              />)
          })}  
          {showAddArea && <AddArea/>}
        </div>
      <Footer/>
    </div>
  );
}

export default App;
