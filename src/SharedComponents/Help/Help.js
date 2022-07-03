import React from 'react';
import './Help.css';
import helpImg from "./img/help.png";

function Help(props) {

    return (
        <>
            <button
                id={"help_button"}
                onClick={()=>{
                    window.location.href=`/user-manual`;
                }}
            >
                <img src={helpImg}/>
            </button>
        </>
    );
}

export default Help;