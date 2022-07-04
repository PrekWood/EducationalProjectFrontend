import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./TestPage.css";
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
import Question from "./Components/Question/Question";
import LoadingAnimation from "../../SharedComponents/LoadingAnimation/LoadingAnimation";
import TestResults from "./Components/TestResults/TestResults";
import Help from "../../SharedComponents/Help/Help";

export default function TestPage() {
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

    const [progressPercentage, setProgressPercentage] = useState(1);
    const [testResults, setTestResults] = useState(null);

    function submitTest(e){
        e.preventDefault();
        setLoadingState(true);

        const formFields = e.target.elements;

        // Get form data
        let answers = [];
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (
                formFields[formFieldIndex].name.includes("question-") &&
                formFields[formFieldIndex].checked
            ) {
                answers.push({
                    idAnswer:formFields[formFieldIndex].attributes["data-answer-id"].value,
                    idQuestion:formFields[formFieldIndex].attributes["data-question-id"].value,
                })
            }
        }

        if(answers.length !== questions.length){
            alert("Παρακαλώ συμπληρώστε όλες τις ερωτήσεις")
            setLoadingState(false);
            return;
        }

        const test = new Test();
        test.idChapter = idChapter;
        test.answers = answers;
        test.submitTest((response)=>{
            setLoadingState(false);
            setTestResults(response.data)
        },()=>{
            setLoadingState(false);
            alert('error')
        })
    }

    const [loadingState, setLoadingState] = useState(false);

    return <>
        <div className={"TestPage"}>

            <div className={"fixed-header"}>
                <h1>
                    <button onClick={() => {
                        window.location.href = "/";
                    }}>
                        <BackSvg/>
                    </button>
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
                <div className={"progress-bar"} data-progress={progressPercentage}>
                    <div className={"progress-bar-inner"} style={{width: `${progressPercentage}%`}}></div>
                </div>
            </div>

            <form onSubmit={submitTest}>
                <div className={"questions"}>
                    {questions.map((question, index) => {
                        return <React.Fragment key={`test-question-${question.id}`}>
                            <Question
                                index = {index}
                                question = {question}
                                questions = {questions}
                                setProgressPercentage={setProgressPercentage}
                            />
                        </React.Fragment>
                    })}
                </div>

                <SubmitButton
                    id={"test_confirmation"}
                    text="Επιβεβαίωση"
                />
            </form>

            <TestResults
                results={testResults}
                idChapter={idChapter}
            />

            <LoadingAnimation state={loadingState}/>
        </div>

        <Help page={11}/>
    </>
}