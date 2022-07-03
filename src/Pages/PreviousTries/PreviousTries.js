import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./PreviousTries.css";
import User from "../../Classes/User";
import {ReactComponent as BackSvg} from "./imgs/back.svg";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import TestQuestion from "../../Classes/TestQuestion";
import Chapter from "../../Classes/Chapter";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Progress from "../../Classes/Progress";
import Test from "../../Classes/Test";
import TestAnswer from "../../Classes/TestAnswer";
import {ReactComponent as StarSvg} from "../TestPage/imgs/star.svg";
import Help from "../../SharedComponents/Help/Help";

export default function PreviousTries() {
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


    // Chapter
    const [chapter, setChapter] = useState(new Chapter());
    const [questions, setQuestions] = useState([new TestQuestion()]);
    const [previousAttempts, setPreviousAttempts] = useState([]);
    useEffect(() => {
        Test.getDetails(
            idChapter,
            (response) => {
                // Parse Chapter
                const chapterTmp = response.data.chapter;
                if (Validate.isEmpty(chapterTmp)) {
                    setChapter(null)
                    return;
                }
                const chapterObj = Chapter.castToChapter(chapterTmp)
                for (let subChapterIndex = 0; subChapterIndex < chapterObj.subChapters.length; subChapterIndex++) {
                    chapterObj.subChapters[subChapterIndex] = SubChapter.castToSubChapter(chapterObj.subChapters[subChapterIndex]);
                }
                for (let questionIndex = 0; questionIndex < chapterObj.testQuestions.length; questionIndex++) {
                    chapterObj.testQuestions[questionIndex] = TestQuestion.castToTestQuestion(chapterObj.testQuestions[questionIndex]);
                }
                setChapter(chapterObj);

                // Parse questions
                const questionsTmp = response.data.questions;
                if (Validate.isEmpty(questionsTmp)) {
                    setQuestions([])
                    return;
                }
                const questionsObjList = [];
                for (let questionIndex = 0; questionIndex < questionsTmp.length; questionIndex++) {
                    let questionTmp = questionsTmp[questionIndex];
                    for (let answerIndex = 0; answerIndex < questionTmp.answerList.length; answerIndex++) {
                        questionTmp.answerList[answerIndex] =
                            TestAnswer.castToTestAnswer(questionTmp.answerList[answerIndex]);
                    }
                    questionsObjList.push(
                        TestQuestion.castToTestQuestion(questionTmp)
                    )
                }
                setQuestions(questionsObjList);

                // Parse previous tries
                const tries = response.data.previousAttempts;
                if (Validate.isEmpty(tries)) {
                    setPreviousAttempts([])
                    return;
                }
                setPreviousAttempts(tries);

            }, () => {
                alert("error")
            }
        )
    }, [])


    return <>
        <div className={"Chapter"}>

            <div className={"container"}>
                <div className={"header"}>
                    <button onClick={() => {
                        window.location.href = `/test/${chapter.id}`;
                    }}>
                        <BackSvg/>
                    </button>
                    <h1>
                        <div className={"chapter-name-container"}>
                            <span>Τέστ Κεφαλαίου "{chapter.name}"</span>
                            <a
                                href={`/test/${idChapter}/previous-tries`}
                                className={"previous-tries"}
                            >
                                {previousAttempts.length} Προηγούμενες προσπάθειες
                            </a>
                        </div>
                    </h1>
                </div>

                <div className={"previous-tries-list"}>
                    <div className={"attempt headers"}>
                        <span className={"index"}>ID</span>
                        <span className={"date-add"}>Ημερομηνία</span>
                        <div className={"stars"}>Αστέρια</div>
                        <span className={"percentage"}>Ποσοστό</span>
                    </div>
                    {previousAttempts.map((previousAttempt, index) => {
                        return <React.Fragment key={`attempt-${index}`} >
                            <div className={"attempt"}>
                                <span className={"index"}>{index+1}</span>
                                <span className={"date-add"}>{previousAttempt.dateAdd}</span>
                                <div className={"stars"}>
                                    {
                                        previousAttempt.grade === "ONE" ?
                                            <>
                                                <StarSvg/>
                                            </>
                                        : previousAttempt.grade === "TWO" ?
                                            <>
                                                <StarSvg/>
                                                <StarSvg/>
                                            </>
                                        :
                                            <>
                                                <StarSvg/>
                                                <StarSvg/>
                                                <StarSvg/>
                                            </>
                                    }
                                </div>
                                <span className={"percentage"}>{Math.round(previousAttempt.percentage*100)} %</span>
                            </div>
                        </React.Fragment>
                    })}
                </div>
            </div>
        </div>

        <Help/>
    </>
}