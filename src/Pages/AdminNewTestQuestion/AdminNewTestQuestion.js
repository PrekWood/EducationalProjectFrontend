import React, {useEffect, useState} from "react";
import "./AdminNewTestQuestion.css";
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
import AdminTestAnswer from "./Components/AdminTestAnswer/AdminTestAnswer";
import TestQuestion from "../../Classes/TestQuestion";
import Help from "../../SharedComponents/Help/Help";

export default function AdminNewTestQuestion() {
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

    // CHapter
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
                    const subChapterObj = SubChapter.castToSubChapter(chapterObj.subChapters[subChapterIndex]);
                    chapterObj.subChapters[subChapterIndex] = subChapterObj;
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


    // Answers
    const [answers, setAnswers] = useState([
        new TestAnswer(1, "Απάντηση 1"),
        new TestAnswer(2, "Απάντηση 2"),
        new TestAnswer(3, "Απάντηση 3"),
        new TestAnswer(4, "Απάντηση 4")
    ]);
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
        let question = null;
        let difficulty = null;
        let type = null;
        let errorType = null;
        let idSubChapter = null;
        let answers = [];
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id === "test_question_question") {
                question = formFields[formFieldIndex].value
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

        const testQuestion = new TestQuestion();
        testQuestion.idChapter = idChapter;
        testQuestion.question = question;
        testQuestion.type = type;
        testQuestion.difficulty = difficulty;
        testQuestion.errorType = errorType;
        testQuestion.answers = answers;
        testQuestion.idSubChapter = idSubChapter;
        testQuestion.create(
            ()=>{
                window.location.href = `/admin/chapter/${idChapter}`;
            },
            ()=>{
                alert("error");
            }
        )
    }

    function getSubChapterOptions(){
        let optionsList = [];
        chapter.subChapters.map((subChapter)=>{
            optionsList.push({
                "id": subChapter.id,
                "name": subChapter.name,
                "value": subChapter.id,
            })
        })
        return optionsList
    }

    return <>
        <div className={"AdminNewTestQuestion"}>
            <h1>
                <a href={"/admin"}>Αρχική</a>
                <span className={"separator"}>/</span>
                <a href={`/admin/chapter/${chapter.id}/`}>{chapter.name}</a>
                <span className={"separator"}>/</span>
                Νέα ερώτηση
            </h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>

            <div className={"test-questions-list center"}>
                <div className={"header"}>
                    Νέα ερώτηση
                </div>

                <form onSubmit={createNewTestQuestion}>
                    <div className={"test-question-form"}>
                        <div>

                            <Textarea
                                id="test_question_question"
                                name="Ερώτηση"
                                validation={Validate.isNotEmpty}
                            />
                            <Select
                                id="test_question_difficulty"
                                name="Δυσκολία"
                                options={[
                                    {
                                        "id": 1,
                                        "name": "Εύκολη",
                                        "value": "EASY"
                                    },
                                    {
                                        "id": 2,
                                        "name": "Κανονική",
                                        "value": "MEDIUM",
                                        "selected": true
                                    },
                                    {
                                        "id": 3,
                                        "name": "Δύσκολη",
                                        "value": "HARD",
                                    }
                                ]}
                            />
                            <Select
                                id="test_question_type"
                                name="Τύπος Ερώτησης"
                                callback={changeType}
                                options={[
                                    {
                                        "id": 1,
                                        "name": "Πολλαπλής επιλογής",
                                        "value": "MULTIPLE_CHOICE",
                                        "selected": true
                                    },
                                    {
                                        "id": 2,
                                        "name": "Σωστό / Λάθος",
                                        "value": "TRUE_FALSE",
                                    }
                                ]}
                            />

                            <Select
                                id="test_question_error"
                                name="Τύπος Σφάλματος"
                                options={[
                                    {
                                        "id": 1,
                                        "name": "Συντακτικό",
                                        "value": "SYNTACTICAL",
                                        "selected": true
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
                                ]}
                            />

                            {Validate.isEmpty(chapter) ? "" : (
                                <Select
                                    id="test_question_subchapter"
                                    name="Θεωρία"
                                    options={getSubChapterOptions()}
                                />
                            )}

                            <SubmitButton
                                id={"test_question_submit"}
                                text="Δημιουργία"
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

        <Help page={27}/>
    </>
}