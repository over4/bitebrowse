import React, { useState } from 'react';
import '../componentStyles/SearchArea.css'; // Import the CSS file for styling

function SearchBar(props) {
    const [cuisine, setCuisine] = useState('');
    const [prep, setPrep] = useState('');
    const [ingredients, setIngredients] = useState('');
  
    const handleCuisineChange = (event) => setCuisine(event.target.value);
    const handlePrepChange = (event) => setPrep(event.target.value);
    const handleIngredientsChange = (event) => setIngredients(event.target.value);
  
    function handleSubmit(event){
      event.preventDefault();
      let searchTerms = {
        cuisine: cuisine, 
        prep: prep,
        ingredients: ingredients
      }
      setCuisine("")
      setPrep("")
      setIngredients("")
      props.submit(searchTerms)
    };
    function handleKeyPress(event){
      if (event.key === 'Enter') {
        let searchTerms = {
          cuisine: cuisine, 
          prep: prep,
          ingredients: ingredients
        }
        setCuisine("")
        setPrep("")
        setIngredients("")
        props.submit(searchTerms)
      }
    }
  return (
    <div className = "searchBarHeader">
      <div className="searchBarContainer">
        <form className="searchBar" onSubmit={handleSubmit} >
          <input
            type="text"
            placeholder="Cuisine"
            value={cuisine}
            onChange={handleCuisineChange}
          />
          <input
            type="text"
            placeholder="Cook-Time In Minutes"
            value={prep}
            onChange={handlePrepChange}
          />
          <input
            type="text"
            placeholder="Ingredient"
            value={ingredients}
            onChange={handleIngredientsChange}
          />
        <button onKeyDown={handleKeyPress} type="submit">🔎</button>
      </form>
    </div>
  </div>
  );
}

export default SearchBar;