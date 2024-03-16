import React, { useState } from 'react';
import PopUp from './PopUp';
import "../componentStyles/AddArea.css"
function AddArea() {
    const [token,setToken] = useState('')
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState({
      title: '',
      cuisine: '',
      prepTime: '',
      rating: '',
      ingredients: '', // Keep as a single string for user input
      spices: '',
      steps: '',
      thumbnailUrl: '',
    });
    const [listOfTitles,setListOfTitles] = useState([])
  
    async function authenticate(){
      // Assuming an authentication function exists
      try{
        const response = await fetch("/api/authenticate?password=" + password)
        const data = await response.json();
        if(data.message ==="Authenticated"){
            //user is good set the token
            setToken(data.token)
            setIsAuthenticated(true)
            //get all the title so user can pick which to delete
            getAllRecipeTitles(data.token)

        }else{
            //not authenticated
            setPopupMessage("Invalid Password");
            setPassword('')
            setShowPopup(true)
            setIsAuthenticated(false)
        }
      }catch(e){
        console.log(e)
      }
    };
  
    function handleChange(e){
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    async function handleSubmit(e){
      e.preventDefault();

      // Convert ingredients and spices from comma-separated strings to arrays
      const ingredientsArray = formData.ingredients.split(',').map(ingredient => ingredient.trim());
      const spicesArray = formData.spices.split(',').map(spice => spice.trim());
      const stepsArray = formData.steps.split(',').map(step => step.trim());
  
      // Prepare the data for submission, including converting strings to arrays
      const submissionData = {
        ...formData,
        ingredients: ingredientsArray,
        spices: spicesArray,
        steps: stepsArray,
      };
  
      fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData),
      });
      setFormData({title: '',
      cuisine: '',
      prepTime: '',
      rating: '',
      ingredients: '', // Keep as a single string for user input
      spices: '',
      steps: '',
      thumbnailUrl: '',})
      getAllRecipeTitles(token)
    };
    function handlePasswordChange(e){
        setPassword(e.target.value)
    }
    async function getAllRecipeTitles(tokenParam){
        const response = await fetch('/api/all', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenParam}`,
              'Content-Type': 'application/json'
            },
          });
          let data = await response.json()
        setListOfTitles(data)
    }
    async function handleDelete(title){
        try{
            let url = '/api/delete?title=' + title
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
            });
            getAllRecipeTitles(token)
        }catch(e){
            console.log(e)
        }
    }
  // Render the password input or the recipe form based on authentication
  return (
    <div className = "add-area">
        <PopUp
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
        />
      {!isAuthenticated ? (
        <div className="form-container">
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Enter password"
                />
                <button type="submit" className="form-submit-button" onClick = {authenticate}>Submit</button>
        </div>
      ) : (
        <div className = "admnin-area">
            <div className = "form-container">
                <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Title"
                />
                <input
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Cuisine"
                />
                <input
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Prep-Time(Minutes)"
                />
                <input
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Rating"
                />
                <input
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ingredients (comma-separated)"
                />
                <input
                    name="spices"
                    value={formData.spices}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Spices (comma-separated)"
                />
                <input
                    name="steps"
                    value={formData.steps}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Steps (comma-separated)"
                />
                <input
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Thumbnail URL"
                />
                <button type="submit" className="form-submit-button">Submit Recipe</button>
                </form>
            </div>
            <div className = "delete-container">
                {listOfTitles.map((item,index)=>{
                    return(
                        <div className = "delete-card">
                            <button onClick={()=> handleDelete(item.title)}>{item.title}</button>
                        </div>
                    )
                })}
            </div>
        </div>
      )}
    </div>
    
  );
}

export default AddArea;