import React, {useEffect, useState} from "react";
import User from "../../Classes/User";
import {Switch, useParams} from "react-router-dom";
import Chapter from "../../Classes/Chapter";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Textarea from "../../SharedComponents/Textarea/Textarea";
import InputField from "../../SharedComponents/InputField/InputField";
import TestQuestion from "../../Classes/TestQuestion";
import HtmlEditor from "../../SharedComponents/HtmlEditor/HtmlEditor";
import Help from "../../SharedComponents/Help/Help";

export default function AdminUpdateChapter() {

    // URL Param
    let {idChapter} = useParams();

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

    const [chapter, setChapter] = useState(new Chapter());
    function hydrateChapter() {
        Chapter.getDetails(
            idChapter,
            (response) => {
                const chapter = response.data;
                if (Validate.isEmpty(chapter)) {
                    setChapter(null)
                    return;
                }
                const chapterObj = Chapter.castToChapter(chapter)

                for (let subChapterIndex = 0; subChapterIndex < chapterObj.subChapters.length; subChapterIndex++) {
                    chapterObj.subChapters[subChapterIndex] = SubChapter.castToSubChapter(chapterObj.subChapters[subChapterIndex]);
                }
                for (let questionIndex = 0; questionIndex < chapterObj.testQuestions.length; questionIndex++) {
                    chapterObj.testQuestions[questionIndex] = TestQuestion.castToTestQuestion(chapterObj.testQuestions[questionIndex]);
                }

                setChapter(chapterObj);
            }, () => {
                alert('error');
            }
        )
    }
    useEffect(() => {
        hydrateChapter();
    }, [])


    function updateChapter(e) {
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

        chapter.name = name;
        chapter.description = description;
        chapter.update(
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
                Επεξεργασία Κεφαλαίου
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <div className={"chapters-list center"}>
                <div className={"header"}>
                    Επεξεργασία Κεφαλαίου
                </div>

                <form onSubmit={updateChapter}>

                    <div className={"sub-chapter-creation-form"}>
                        <InputField
                            id="chapter_name"
                            name="Τίτλος"
                            validation={Validate.isNotEmpty}
                            defaultValue={chapter.name}
                        />
                        <br/>
                        <br/>

                        <HtmlEditor
                            id="chapter_description"
                            name="Περιγραφή"
                            defaultValue={chapter.description}
                        />

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