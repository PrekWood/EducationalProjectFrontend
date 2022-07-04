import React, {useEffect, useState} from "react";
import "./AdminNewChapter.css";
import User from "../../Classes/User";
import {Switch, useParams} from "react-router-dom";
import Chapter from "../../Classes/Chapter";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Textarea from "../../SharedComponents/Textarea/Textarea";
import TestAnswer from "../../Classes/TestAnswer";
import InputField from "../../SharedComponents/InputField/InputField";
import HtmlEditor from "../../SharedComponents/HtmlEditor/HtmlEditor";
import Help from "../../SharedComponents/Help/Help";

export default function AdminNewChapter() {

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


    useEffect(()=>{
        Chapter.getNextName((resp)=>{
            document.getElementById("chapter_name").value = resp.data.message;
        })
    },[]);


    function createNewSubChapter(e) {
        e.preventDefault();
        const formFields = e.target.elements;

        // Get form data
        let name = null;
        let description = null;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id === "chapter_name") {
                name = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "chapter_description") {
                description = formFields[formFieldIndex].value
            }
        }

        const chapter = new Chapter();
        chapter.name = name;
        chapter.description = description;
        chapter.create(
            () => {
                window.location.href = `/admin`;
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
                Νέο κεφάλαιο
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <div className={"chapters-list center"}>
                <div className={"header"}>
                    Νέο κεφάλαιο
                </div>

                <form onSubmit={createNewSubChapter}>

                    <div className={"sub-chapter-creation-form"}>
                        <InputField
                            id="chapter_name"
                            name="Τίτλος"
                            validation={Validate.isNotEmpty}
                        />
                        <br/>
                        <br/>

                        <HtmlEditor
                            id="chapter_description"
                            name="Περιγραφή"
                        />

                        <SubmitButton
                            id={"test_question_submit"}
                            text="Δημιουργία"
                        />
                    </div>
                </form>

            </div>
        </div>

        <Help page={15}/>
    </>
}