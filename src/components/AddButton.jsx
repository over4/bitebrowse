import React from "react";
import "../componentStyles/AddButton.css"
import AddIcon from '@mui/icons-material/Add';

function AddButton(props){
    function handleClick(){
        props.add()
    }
    return (
    <div className = "add-button-div">
        <button className = "add-button" onClick={handleClick}>
            <AddIcon/>
        </button>
    </div>
    )
}export default AddButton