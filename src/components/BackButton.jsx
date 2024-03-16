import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import '../componentStyles/BackButton.css'; // Import the CSS file for styling

function BackButton(props){
    function handleClick(){
        props.back()
    }
    return (
    <div className = "back-button-div">
        <button className = "back-button" onClick={handleClick}>
            <HomeIcon/>
        </button>
    </div>
    )
}export default BackButton