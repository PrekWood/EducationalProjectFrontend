import React, {useEffect, useRef, useState} from 'react';
import './Textarea.css';


function Textarea(props) {

    const [isValid, setValid] = useState(null);

    const [defaultValue, setDefaultValue] = useState(null);
    useEffect(()=>{
        setDefaultValue(props.defaultValue);
    },[props.defaultValue])

    if (!("id" in props) || !("name" in props)) {
        return <p>
            Textarea needs id and name
        </p>
    }

    let validation = (value) => { return true }
    if ("validation" in props) {
        validation = props.validation;
    }
    let rows = 2;
    if ("rows" in props) {
        rows = props.rows;
    }

    function onKeyUp(event) {
        // Validation
        let isCurrentValueValid = null;
        if (typeof validation == "function") {
            isCurrentValueValid = validation(event.target.value)
        } else {
            validation.forEach(validationMethod => {
                if (validationMethod(event.target.value)) {
                    if (isCurrentValueValid == null || isCurrentValueValid) {
                        isCurrentValueValid = true;
                    } else {
                        isCurrentValueValid = false;
                    }
                } else {
                    isCurrentValueValid = false;
                }
            });
        }
        setValid(isCurrentValueValid ? "valid" : "invalid");
    }


    return (
        <>
            <div className={`form-field ${isValid == null ? "" : isValid} `}>
                <textarea
                    id={props.id}
                    onKeyUp={onKeyUp}
                    rows={rows}
                    defaultValue={defaultValue}
                ></textarea>
                <label htmlFor={props.id}>
                    {props.name}
                </label>
            </div>
        </>
    );
}

export default Textarea;