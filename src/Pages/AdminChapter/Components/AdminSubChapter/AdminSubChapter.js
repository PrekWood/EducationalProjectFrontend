import React, {useEffect, useState} from "react";
import User from "../../../../Classes/User";
import {ReactComponent as ArrowSvg} from "./imgs/dropdown-toggler.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import Validate from "../../../../Classes/Validate";

export default function AdminSubChapter(props) {

    const [dropDownState, seDropDownState] = useState(false);

    const [renameState, setRenameState] = useState(false);

    function rename(e) {
        e.preventDefault();
        setRenameState(false)

        const formFields = e.target.elements;
        let newName = null;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].name === "chapter-name-field") {
                newName = formFields[formFieldIndex].value
            }
        }
        props.subChapter.renameTo(
            newName,
            () => {
                setRenameState(false);
                seDropDownState(false);
                props.reHydrateListing();
            },
            () => {
                alert("error");
            }
        )
    }

    function deleteChapter() {
        props.subChapter.delete(
            () => {
                setRenameState(false);
                seDropDownState(false);
                props.reHydrateListing();
            },
            () => {
                alert("error");
            }
        )
    }

    return <>
        {Validate.isEmpty(props.subChapter) ? "" :
            (
                <div className={"chapter-admin-container subchapter"} key={`subchapter-${props.subChapter.id}`}>
                    <div className={"chapter-admin"}>
                        <span className={"id chapter-small"}>{props.subChapter.id}</span>
                        <form className={`rename-form ${renameState ? "open" : ""}`} onSubmit={rename}>
                            {!renameState ?
                                <>
                                    <span className={"chapter-name "}>{props.subChapter.name}</span>
                                </>
                                :
                                <>
                                    <input type={"text"} name={"chapter-name-field"} defaultValue={props.subChapter.name}/>
                                    <button type={"submit"}>
                                        <SaveSvg/>
                                    </button>
                                </>
                            }
                        </form>
                        <span className={"chapter-small"}>{props.subChapter.dateAdd}</span>
                        <div></div>
                    </div>

                    <div className={`chapter-actions ${dropDownState ? "open" : ""}`}>
                        <button className={"chapter-preview"} onClick={() => {
                            window.location.href = `/admin/subchapter/${props.subChapter.id}`;
                        }}>
                            Επεξεργασία
                        </button>
                        <button className={"chapter-dropdown-toggler"} onClick={() => {
                            seDropDownState(!dropDownState)
                        }}>
                            <ArrowSvg/>
                        </button>
                        <div className={`dropdown-list ${dropDownState ? "open" : ""}`}>
                            <button onClick={() => {
                                deleteChapter()
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