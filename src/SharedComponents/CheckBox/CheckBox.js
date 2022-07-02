import React, { useRef, useState } from 'react';
import './CheckBox.css';
import {ReactComponent as CheckSvg} from "./imgs/check.svg";


function CheckBox(props) {


    if (!("id" in props) || !("text" in props)) {
        return <p>
            CheckBox needs id and name
        </p>
    }


    return (
        <>
            <div className={`form-checkbox checkbox-${props.state?"checked":"not-checked"}`} >
                <input
                    type="checkbox"
                    className="checkbox-hidden-input"
                    id={props.id}
                    name={props.name}
                    onChange={()=>{props.callback()}}
                />
                <div className={`checkbox-container ${props.state?"checked":"not-checked"}`} onClick={
                    ()=>{document.getElementById(props.id).click()}
                }>
                    <CheckSvg/>
                </div>
                <label htmlFor={props.id}>{props.text}</label>
            </div>
        </>
    );
}

export default CheckBox;