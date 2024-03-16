import React from "react";
import Button from '@mui/material/Button';
import "../componentStyles/PopUp.css";

function PopUp(props){
    if (!props.show) {
        return null;
      }
    
      return (
        <div className = "popUpParent">
            <div className = "popUp">
                <p>{props.message}</p>
                <Button variant="contained" size="small"  onClick={props.onClose}>Close</Button>
            </div>
        </div>
      );
}export default PopUp