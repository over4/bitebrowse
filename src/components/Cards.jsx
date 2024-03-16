import React, { useState, useEffect } from 'react';
import '../componentStyles/Card.css'; // Import the CSS file for styling

function Card(props){
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState('initial');
  

  function toggleExpand(){
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    // Adjust font size based on title length
    const adjustFontSize = () => {
      if (props.title.length > 20) { // Assuming titles longer than 20 characters need adjustment
        setFontSize('12px'); // Set to a smaller font size or calculate the size
      } else {
        setFontSize('initial'); // Set to the default size
      }
    };

    adjustFontSize();
  }, [props.title]);
    // Adjust the style to include dynamic height
    const cardStyle = {
        cursor: 'pointer',
        width: isExpanded ? '85%' :'300px', // Keep the width constant or adjust as needed
        transition: 'all 0.3s ease-in-out',
        minWidth: isExpanded ? '85%': '300px',
        backgroundColor: isExpanded && 'gray',
        marginRight: isExpanded && '5%',
        marginLeft: isExpanded && '5%',
        height: isExpanded ? 'auto' : '15%', // Adjust '300px' to fit the card's content snugly in its unexpanded state
    };
    const imageStyle = {
        width: '300px', // Set width to 150px
        height: '300px', // Set height to 150px
        objectFit: 'cover', // Ensure the image covers the area without distortion
        marginTop:  isExpanded ? '1rem' : '0',
        marginBottom:  isExpanded ? '1rem' : '0',
        borderRadius: isExpanded ? '50%' : '0%', // Optional: Round the image when expanded
    };

  return (
    <div className="card" onClick={toggleExpand} style={cardStyle}>
        <div className = "card-img-div"><img src={props.thumbnailUrl} style={{...imageStyle}}/></div>
        { isExpanded && <div className="card-content" >
            <div className = "card-top-area">
                    <h1>Cuisine: {props.cuisine ?? "none"}</h1>
                    <h1>Cooking Time: {props.prepTime} Minutes</h1>
                    <h1>{props.rating}</h1>
            </div>
            <div className= "card-middle">
                    <div className="middle-left">
                        <h2>Ingredients</h2>
                        <div className = "card-ingredients">
                            {props.ingredients && props.ingredients.map((item,index)=>{
                                return(<li key = {index} >{item}</li>)
                            })}
                        </div>
                    </div>
                    <div className="middle-right">
                        <h2>Spices</h2>
                        <div className = "card-spices">
                            {props.spices && props.spices.map((item,index)=>{
                                return(<li key = {index} >{item}</li>)
                            })}
                        </div>
                    </div>
            </div>
            <div className = "card-bottom">
                <h2>Instructions</h2>
                <ol className = "step-list">
                    {props.steps.map((item,index)=>{
                        return(<li key = {index} >{item}</li>)
                    })}
                </ol>
            </div>
        </div>}
        { !isExpanded && <div className = "card-Title"><h3 style={{fontSize}}>{props.title}</h3></div>}
    </div>
  );
};

export default Card;