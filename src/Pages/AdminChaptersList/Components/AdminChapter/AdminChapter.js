import React, {useEffect, useState} from "react";
import User from "../../../../Classes/User";
import {ReactComponent as ArrowSvg} from "./imgs/dropdown-toggler.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import Validate from "../../../../Classes/Validate";

export default function AdminChapter(props) {

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
        props.chapter.renameTo(
            newName,
            () => {
                props.reHydrateChapters();
            },
            () => {
                alert("error");
            }
        )
    }

    function deleteChapter() {
        props.chapter.delete(
            () => {
                props.reHydrateChapters();
            },
            () => {
                alert("error");
            }
        )
    }

    return <>
        {Validate.isEmpty(props.chapter) ? "" :
            (
                <div className={"chapter-admin-container"} key={props.chapter.id}>
                    <div className={"chapter-admin"}>
                        <span className={"id chapter-small"}>{props.chapter.id}</span>
                        <form className={`rename-form ${renameState ? "open" : ""}`} onSubmit={rename}>
                            {!renameState ?
                                <>
                                    <span className={"chapter-name "}>{props.chapter.name}</span>
                                </>
                                :
                                <>
                                    <input type={"text"} name={"chapter-name-field"} defaultValue={props.chapter.name}/>
                                    <button type={"submit"}>
                                        <SaveSvg/>
                                    </button>
                                </>
                            }
                        </form>
                        <span className={"chapter-small"}>
                            {props.chapter.subChapters.length === 1 ?
                                `1 Υποκεφάλαιο` :
                                `${props.chapter.subChapters.length} Υποκεφάλαια`
                            }
                        </span>
                        <span className={"chapter-small"}>{props.chapter.dateAdd}</span>
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
                                setRenameState(true);
                                seDropDownState(false);
                            }}>
                                Μετονομασία
                            </button>
                            <button onClick={() => {
                                window.location.href=`/admin/chapter/${props.chapter.id}/update`
                            }}>
                                Επεξεργασία
                            </button>
                            <button onClick={() => {
                                if(window.confirm("Είστε σίγουρος πως θέλετε να διαγράψετε το συγκεκριμένο κεφάλαιο και τα περιεχόμενα του;")){
                                    deleteChapter()
                                }
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