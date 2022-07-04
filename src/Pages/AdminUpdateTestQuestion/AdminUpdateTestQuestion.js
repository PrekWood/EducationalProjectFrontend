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
import TestQuestion from "../../Classes/TestQuestion";
import AdminTestAnswer from "../AdminNewTestQuestion/Components/AdminTestAnswer/AdminTestAnswer";
import Test from "../../Classes/Test";
import Question from "../TestPage/Components/Question/Question";
import Help from "../../SharedComponents/Help/Help";

export default function AdminUpdateTestQuestion() {
    // URL Param
    let {idTestQuestion} = useParams();

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

    // Chapter
    const [question, setQuestion] = useState(new TestQuestion());
    const [answers, setAnswers] = useState([]);
    useEffect(() => {
        TestQuestion.getDetails(
            idTestQuestion,
            (response) => {

                // Parse Question
                const questionTmp = response.data;
                if (Validate.isEmpty(questionTmp)) {
                    setQuestion(new TestQuestion())
                    return;
                }
                const questionObj = TestQuestion.castToTestQuestion(questionTmp)
                questionObj.chapter = Chapter.castToChapter(questionObj.chapter)
                setQuestion(questionObj);

                // Answers
                setAnswers(questionObj.answerList)

                // CorrectAnswer
                const correctAnswer = response.data.correctAnswer;
                setCorrectAnswer(correctAnswer);

                setLoaded(true);

            }, () => {
                alert("error")
            }
        )
    }, [])

    function addAnswer(e) {
        e.preventDefault();
        let maxId = -1;
        answers.map((ans) => {
            if (ans.id > maxId) {
                maxId = ans.id;
            }
        })
        setAnswers([...answers, new TestAnswer(maxId + 1, `Απάντηση ${maxId + 1}`)]);
    }
    function deleteAnswer(id) {
        setAnswers(answers.filter(answer => answer.id !== id));
    }
    const [correctAnswer, setCorrectAnswer] = useState(new TestAnswer(1));


    // Test Question
    function changeType(option) {
        if (option.id === 2) {
            setAnswers([
                new TestAnswer(5, "Σωστό"),
                new TestAnswer(6, "Λάθος"),
            ])
            setCorrectAnswer(new TestAnswer(5, "Σωστό"));
        } else {
            setAnswers([
                new TestAnswer(1, "Απάντηση 1"),
                new TestAnswer(2, "Απάντηση 2"),
                new TestAnswer(3, "Απάντηση 3"),
                new TestAnswer(4, "Απάντηση 4")
            ])
            setCorrectAnswer(new TestAnswer(1, "Απάντηση 1"));
        }
    }

    function createNewTestQuestion(e) {
        e.preventDefault();
        const formFields = e.target.elements;

        // Get form data
        let questionText = null;
        let difficulty = null;
        let type = null;
        let errorType = null;
        let answers = [];
        let idSubChapter = null;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id === "test_question_question") {
                questionText = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "test_question_difficulty") {
                difficulty = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "test_question_type") {
                type = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "test_question_error") {
                errorType = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id === "test_question_subchapter") {
                idSubChapter = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].name === "chapter-name-field") {
                let answerToPush = new TestAnswer(
                    formFields[formFieldIndex].attributes["data-id"].value,
                    formFields[formFieldIndex].value
                );
                answerToPush.correct = answerToPush.id == correctAnswer.id
                answers.push(answerToPush);
            }
        }

        question.question = questionText;
        question.type = type;
        question.difficulty = difficulty;
        question.errorType = errorType;
        question.answers = answers;
        question.idSubChapter = idSubChapter;
        question.update(
            ()=>{
                window.location.href = `/admin/chapter/${question.chapter.id}`;
            },
            ()=>{
                alert("error");
            }
        )
    }

    const [loaded, setLoaded] = useState(false);
    function getDifficultyOptions(){
        let difficultyOptionsTmp = [
            {
                "id": 1,
                "name": "Εύκολη",
                "value": "EASY"
            },
            {
                "id": 2,
                "name": "Κανονική",
                "value": "MEDIUM",
            },
            {
                "id": 3,
                "name": "Δύσκολη",
                "value": "HARD",
            }
        ]
        for(let difficultyOptionsIndex = 0; difficultyOptionsIndex<difficultyOptionsTmp.length; difficultyOptionsIndex++){
            if(difficultyOptionsTmp[difficultyOptionsIndex].value == question.difficulty){
                difficultyOptionsTmp[difficultyOptionsIndex].selected = true;
            }
        }
        return difficultyOptionsTmp;
    }
    function getQuestionTypeOptions(){
        let questionTypeOptions = [
            {
                "id": 1,
                "name": "Πολλαπλής επιλογής",
                "value": "MULTIPLE_CHOICE",
            },
            {
                "id": 2,
                "name": "Σωστό / Λάθος",
                "value": "TRUE_FALSE",
            }
        ]
        if(question.answerList.length > 2){
            questionTypeOptions[0].selected = true;
        }else{
            questionTypeOptions[1].selected = true;
        }
        return questionTypeOptions;
    }
    function getErrorTypeOptions(){
        let errorTypeOptions = [
            {
                "id": 1,
                "name": "Συντακτικό",
                "value": "SYNTACTICAL",
            },
            {
                "id": 2,
                "name": "Λογικό",
                "value": "LOGICAL",
            },
            {
                "id": 3,
                "name": "Απροσεξίας",
                "value": "CARELESSNESS",
            },
            {
                "id": 4,
                "name": "Ορθογραφικό",
                "value": "MISSPELLING",
            }
        ]
        for(let i = 0; i<errorTypeOptions.length; i++){
            if(errorTypeOptions[i].value == question.errorType){
                errorTypeOptions[i].selected = true;
            }
        }
        return errorTypeOptions;
    }

    function getSubChapterOptions(){
        let optionsList = [];
        if(question == null){
            return;
        }
        question.chapter.subChapterList.map((subChapter)=>{
            optionsList.push({
                "id": subChapter.id,
                "name": subChapter.name,
                "value": subChapter.id,
                "selected":question.subChapter == null ? false : subChapter.id === question.subChapter.id
            })
        })
        return optionsList
    }

    return <>
        <div className={"AdminNewTestQuestion"}>
            <h1>
                <a href={"/admin"}>Αρχική</a>
                <span className={"separator"}>/</span>
                <a href={`/admin/chapter/${question.chapter.id}/`}>{question.chapter.name}</a>
                <span className={"separator"}>/</span>
                Επεξεργασία ερώτησης
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <div className={"test-questions-list center"}>
                <div className={"header"}>
                    Επεξεργασία ερώτησης
                </div>

                <form onSubmit={createNewTestQuestion}>
                    <div className={"test-question-form"}>
                        <div>

                            <Textarea
                                id="test_question_question"
                                name="Ερώτηση"
                                validation={Validate.isNotEmpty}
                                defaultValue={question.question}
                            />

                            {!loaded ? "" : (
                                <>
                                    <Select
                                        id="test_question_difficulty"
                                        name="Δυσκολία"
                                        options={getDifficultyOptions()}
                                    />
                                    <Select
                                        id="test_question_type"
                                        name="Τύπος Ερώτησης"
                                        callback={changeType}
                                        options={getQuestionTypeOptions()}
                                    />
                                    <Select
                                        id="test_question_error"
                                        name="Τύπος Σφάλματος"
                                        options={getErrorTypeOptions()}
                                    />
                                    <Select
                                        id="test_question_subchapter"
                                        name="Θεωρία"
                                        options={getSubChapterOptions()}
                                    />
                                </>
                            )}

                            <SubmitButton
                                id={"test_question_submit"}
                                text="Επεξεργασία"
                            />
                        </div>

                        <div className={"test-answers"}>
                            <div className={"test-answer-header"}>
                                <h2>Απαντήσεις</h2>
                                <button className={"add-button"} onClick={addAnswer}>
                                    <AddSvg/>
                                </button>
                            </div>

                            <div className={"test-answer-list"}>
                                {answers.map((answer) => {
                                    return <>
                                        <AdminTestAnswer
                                            answer={answer}
                                            correctAnswer={correctAnswer}
                                            setCorrectAnswer={setCorrectAnswer}
                                            deleteAnswer={deleteAnswer}
                                        />
                                    </>
                                })}
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>

        <Help page={31}/>
    </>
}