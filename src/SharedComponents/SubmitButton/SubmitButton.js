import React from 'react';
import './SubmitButton.css';
import Validate from "../../Classes/Validate";
import {ReactComponent as ArrowSvg} from "./imgs/arrow.svg";

function SubmitButton(props) {

    let onClickFunction = () => { };
        if ("callback" in props) {
        onClickFunction = props.callback;
    }

    return (
        <>
            <button
                type="submit"
                className="submit-button"
                id={props.id}
                onClick={onClickFunction}
            >
                {Validate.isEmpty(props.svg) ? "" : <img src={props.svg} />}
                <span>{props.text}</span>
                <ArrowSvg/>
            </button>
        </>
    );
}

export default SubmitButton;