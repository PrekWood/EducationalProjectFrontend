import React, {useEffect, useState} from "react";
import "./AdminChapter.css";
import User from "../../Classes/User";
import {useParams} from "react-router-dom";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import {ReactComponent as AddSvg} from "./imgs/add.svg";
import Chapter from "../../Classes/Chapter";
import Validate from "../../Classes/Validate";
import AdminSubChapter from "./Components/AdminSubChapter/AdminSubChapter";
import SubChapter from "../../Classes/SubChapter";
import AdminSubChapterList from "./Components/AdminSubChapterList/AdminSubChapterList";
import AdminTestQuestionsList from "./Components/AdminTestQuestionsList/AdminTestQuestionsList";
import TestQuestion from "../../Classes/TestQuestion";
import Help from "../../SharedComponents/Help/Help";

export default function AdminChapter() {
    // URL Param
    let {idChapter} = useParams();

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

    function logout() {
        user.logout();
        window.location.href = "/login";
    }


    return <>
        <div className={"AdminChaptersList"}>
            <h1>
                <a href={"/admin"}>Αρχική</a>
                <span className={"separator"}>/</span>
                {chapter.name}
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <AdminSubChapterList
                chapter={chapter}
                hydrateChapter={hydrateChapter}
            />
            <AdminTestQuestionsList
                chapter={chapter}
                hydrateChapter={hydrateChapter}
            />

            <Help page={20}/>
        </div>
    </>
}