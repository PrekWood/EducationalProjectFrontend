import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./ChapterPage.css";
import User from "../../Classes/User";
import {ReactComponent as BackSvg} from "./imgs/back.svg";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import TestQuestion from "../../Classes/TestQuestion";
import Chapter from "../../Classes/Chapter";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Progress from "../../Classes/Progress";
import Help from "../../SharedComponents/Help/Help";

export default function ChapterPage() {
    // URL Param
    let {idChapter} = useParams();

    // User
    const [user, setUser] = useState(new User());
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

    // PreviousTries
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


    return <>
        <div className={"Chapter"}>

            <div className={"container"}>
                <div className={"header"}>
                    <button onClick={() => {
                        window.location.href = "/";
                    }}>
                        <BackSvg/>
                    </button>
                    <h1>{chapter.name}</h1>
                </div>

                <span
                    className={"desc"}
                    dangerouslySetInnerHTML={{ __html: chapter.description }}
                >
                </span>

                <SubmitButton
                    callback={()=>{
                        Progress.markAsRead(
                            chapter,
                            ()=>{
                                window.location.href=`/`;
                            }
                        );
                    }}
                    id={"next_step_button"}
                    text="Συνέχεια"
                />
            </div>
        </div>

        <Help/>
    </>
}