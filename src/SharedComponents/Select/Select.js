import React, { useEffect, useState } from 'react';
import './Select.css';
import arrowSvg from './imgs/arrow.svg';
import Validate from '../../Classes/Validate';
import Option from "./Components/Option/Option";

export default function Select(props) {

    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const [dropDownState, setDropDownState] = useState("closed");

    useEffect(() => {
        setOptions(props.options);
        if (!Validate.isArrayEmpty(props.options)) {
            const optionsWithSelectedAttr = props.options.filter((option) => { return option.selected });
            if (selectedOption == null) {
                if (optionsWithSelectedAttr.length === 1) {
                    setSelectedOption(optionsWithSelectedAttr[0]);
                } else {
                    setSelectedOption(props.options[0]);
                }
            }
        }
    }, [props.options]);

    function openDropDownList() {
        setDropDownState("open");
    }

    function closeDropDownList() {
        setDropDownState("closed");
    }


    let callback = ()=>{};
    if ("callback" in props) {
        callback = props.callback;
    }

    function selectOption(option) {
        setSelectedOption(option)
        setDropDownState("closed");
        callback(option);
    }

    if (!("id" in props) || !("name" in props)) {
        return <p>
            Select needs id and name
        </p>
    }

    let arrowIcon = arrowSvg;
    if ("arrowIcon" in props) {
        arrowIcon = props.arrowIcon;
    }

    return (
        <>
            {Validate.isArrayEmpty(options) ? "" : (
                <>
                    <div className={`select-field form-field ${dropDownState} ${props.class}`} >
                        <select className={`hidden-select`}
                            onChange={(e) => {
                                callback(e)
                            }}
                            id={props.id}
                            value={Validate.isEmpty(selectedOption.value) ? selectedOption.id : selectedOption.value}
                        >
                            {options.map(option => (
                                <option
                                    key={`option-s-${option.id}`}
                                    value={Validate.isEmpty(option.value) ? option.id : option.value}
                                >{option.name}</option>
                            ))}
                        </select>
                        <div className="select" >
                            <div className="select-visible-part" onClick={openDropDownList}>
                                <div className={`select-selected-option option-${selectedOption.id}`}>
                                    <img src={selectedOption.svg == "" ? "" : selectedOption.svg} />
                                    <span>
                                        {selectedOption.name}
                                    </span>
                                </div>
                                <img className="select-arrow" src={arrowIcon} />
                            </div>
                            <div className="select-drop-down-list">
                                {options.map(option => (
                                    <Option
                                        key={`option-${option.id}`}
                                        option={option}
                                        selectOption={selectOption}
                                        language={props.language}
                                    />
                                ))}
                            </div>
                        </div>
                        <label className={"force-open"} htmlFor={props.id}>
                            {props.name}
                        </label>
                    </div>
                    <div className={`select-filter ${dropDownState}`} onClick={closeDropDownList}></div>
                </>
            )}
        </>
    );
}