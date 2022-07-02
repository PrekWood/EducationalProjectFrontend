import React, {useEffect, useState} from "react";
import User from "../../../../Classes/User";
import {ReactComponent as ArrowSvg} from "./imgs/dropdown-toggler.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import Validate from "../../../../Classes/Validate";
import CheckBox from "../../../../SharedComponents/CheckBox/CheckBox";

export default function AdminTestAnswer(props) {

    return <>
        {Validate.isEmpty(props.answer) ? "" :
            (
                <div className={"chapter-admin-container answer"} key={`test-answer-${props.answer.id}`}>
                    <CheckBox
                        text=""
                        name="chapter-is-correct"
                        id={`chapter_is_correct_${props.answer.id}`}
                        state={props.answer.id===props.correctAnswer.id}
                        callback={()=>{
                            props.setCorrectAnswer(props.answer)
                        }}
                    />

                    <div className={"chapter-admin"}>
                        <div className={`rename-form open`}>
                            <input
                                type={"text"}
                                name={"chapter-name-field"}
                                data-id={props.answer.id}
                                defaultValue={props.answer.answer}
                            />
                        </div>
                        <span className={"chapter-small"}></span>
                        <div></div>
                    </div>

                    <div className={`chapter-actions`}>
                        <button className={"chapter-preview"} onClick={() => {
                            props.deleteAnswer(props.answer.id);
                        }}>
                            Διαγραφή
                        </button>
                    </div>
                </div>
            )
        }
    </>
}