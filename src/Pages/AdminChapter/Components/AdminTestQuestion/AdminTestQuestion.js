import React, {useEffect, useState} from "react";
import User from "../../../../Classes/User";
import {ReactComponent as ArrowSvg} from "./imgs/dropdown-toggler.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import Validate from "../../../../Classes/Validate";

export default function AdminTestQuestion(props) {

    const [dropDownState, seDropDownState] = useState(false);

    const [renameState, setRenameState] = useState(false);

    function deleteQuestion() {
        props.question.delete(
            () => {
                setRenameState(false);
                seDropDownState(false);
                props.hydrateChapter();
            },
            () => {
                alert("error");
            }
        )
    }
    function getSwitchTypeText(t) {
        switch (t){
            case "MULTIPLE_CHOICE":
                return "Πολλαπλής επιλογής"
            case "TRUE_FALSE":
                return "Σωστό / Λάθος"
        }
    }

    return <>
        {Validate.isEmpty(props.question) ? "" :
            (
                <div className={"chapter-admin-container subchapter"} key={`subchapter-${props.question.id}`}>
                    <div className={"chapter-admin"}>
                        <span className={"id chapter-small"}>{props.question.id}</span>
                        <form className={`rename-form ${renameState ? "open" : ""}`} >
                            {!renameState ?
                                <>
                                    <span className={"chapter-name "}>{props.question.question}</span>
                                </>
                                :
                                <>
                                    <input type={"text"} name={"chapter-name-field"} defaultValue={props.question.name}/>
                                    <button type={"submit"}>
                                        <SaveSvg/>
                                    </button>
                                </>
                            }
                        </form>
                        <span className={"chapter-small"}>{getSwitchTypeText(props.question.type)}</span>
                        <div></div>
                    </div>

                    <div className={`chapter-actions ${dropDownState ? "open" : ""}`}>
                        <button className={"chapter-preview"} onClick={() => {
                            window.location.href = `/admin/chapter/${props.chapter.id}`;
                        }}>
                            Προβολή
                        </button>
                        <button className={"chapter-dropdown-toggler"} onClick={() => {
                            seDropDownState(!dropDownState)
                        }}>
                            <ArrowSvg/>
                        </button>
                        <div className={`dropdown-list ${dropDownState ? "open" : ""}`}>
                            <button onClick={() => {
                                deleteQuestion()
                            }}>
                                Διαγραφή
                            </button>
                        </div>
                        <div className={`dropdown-list-filter ${dropDownState ? "open" : ""}`} onClick={() => {
                            seDropDownState(false)
                        }}></div>
                    </div>
                </div>
            )
        }
    </>
}