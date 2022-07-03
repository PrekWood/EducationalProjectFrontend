import React, {useEffect, useState} from "react";
import User from "../../Classes/User";
import {Switch, useParams} from "react-router-dom";
import Chapter from "../../Classes/Chapter";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import {ReactComponent as AddSvg} from "./imgs/add.svg";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Textarea from "../../SharedComponents/Textarea/Textarea";
import Select from "../../SharedComponents/Select/Select";
import TestAnswer from "../../Classes/TestAnswer";
import AdminSubChapter from "../AdminChapter/Components/AdminSubChapter/AdminSubChapter";
import TestQuestion from "../../Classes/TestQuestion";
import InputField from "../../SharedComponents/InputField/InputField";
import HtmlEditor from "../../SharedComponents/HtmlEditor/HtmlEditor";
import Help from "../../SharedComponents/Help/Help";

export default function AdminUpdateSubChapter() {
    // URL Param
    let {idSubChapter} = useParams();

    // User
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Load user
        const user = User.loadUserFromLocalStorage();
        // check if token is not expired
        user.getUserDetailsWithAdminPrivileges(
            (response) => {
                const loggedInUser = User.castToUser(response.data)
                loggedInUser.token = user.token;
                setUser(loggedInUser)
            },
            (request) => {
                window.location.href = "/login";
            }
        )
    }, []);

    function logout() {
        user.logout();
        window.location.href = "/login";
    }

    // SubChapter
    const [subChapter, setSubChapter] = useState(new SubChapter());
    useEffect(() => {
        SubChapter.getDetails(
            idSubChapter,
            (response) => {
                const subChapter = response.data;
                if (Validate.isEmpty(subChapter)) {
                    setSubChapter(new SubChapter())
                    return;
                }
                setSubChapter(SubChapter.castToSubChapter(subChapter));
            }, () => {
                alert('error');
            }
        )
    }, [])

    function updateSubChapter(e) {
        e.preventDefault();
        const formFields = e.target.elements;

        // Get form data
        let name = null;
        let theory = null;
        let examples = null;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id === "subchapter_name") {
                name = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "subchapter_theory") {
                theory = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "subchapter_examples") {
                examples = formFields[formFieldIndex].value
            }
        }

        subChapter.idChapter = subChapter.chapter.id;
        subChapter.name = name;
        subChapter.theory = theory;
        subChapter.examples = examples;
        subChapter.update(
            () => {
                window.location.href = `/admin/chapter/${subChapter.idChapter}`;
            },
            () => {
                alert("error");
            }
        )
    }

    return <>
        <div className={"AdminNewTestQuestion"}>
            <h1>
                <a href={"/admin"}>Αρχική</a>
                <span className={"separator"}>/</span>
                <a href={`/admin/chapter/${subChapter.id}/`}>{subChapter.name}</a>
                <span className={"separator"}>/</span>
                Επεξεργασία υποκεφάλαιου
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <div className={"sub-chapters-list center"}>
                <div className={"header"}>
                    Επεξεργασία υποκεφάλαιου
                </div>

                <form onSubmit={updateSubChapter}>

                    <div className={"sub-chapter-creation-form"}>
                        <InputField
                            id="subchapter_name"
                            defaultValue={subChapter.name}
                            name="Τίτλος"
                            validation={Validate.isNotEmpty}
                        />
                        <br/>
                        <br/>
                        <div className={"flex"}>
                            <HtmlEditor
                                id="subchapter_theory"
                                defaultValue={subChapter.theory}
                                name="Θεωρία"
                            />

                            <div className={"examples"}>
                                <HtmlEditor
                                    id="subchapter_examples"
                                    defaultValue={subChapter.examples}
                                    name="Παραδείγματα"
                                />
                            </div>
                        </div>

                        <SubmitButton
                            id={"test_question_submit"}
                            text="Ενημέρωση"
                        />
                    </div>
                </form>

            </div>
        </div>

        <Help/>
    </>
}