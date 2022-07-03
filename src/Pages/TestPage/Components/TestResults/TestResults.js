import React, {useEffect, useState} from "react";

import happyImoji from "./../../imgs/imoji_happy.svg"
import sadImoji from "./../../imgs/imoji_sad.svg"
import inLoveImoji from "./../../imgs/imoji_in_love.svg"
import {ReactComponent as StarSvg} from "./../../imgs/star.svg"
import trophyImg from "./../../imgs/trophy.png"
import Question from "../Question/Question";
import SubmitButton from "../../../../SharedComponents/SubmitButton/SubmitButton";
import Progress from "../../../../Classes/Progress";
import Validate from "../../../../Classes/Validate";

export default function TestResults(props) {

    const [showFinishModal, setShowFinishModal] = useState(false);

    function getWrongAttempts(){
        return props.results.answers.filter((ans)=>!ans.correct);
    }

    return <div className={`test-results ${props.results == null?"empty":"full"}`}>
        {props.results == null ? "" : (
            <>
                <div className={"test-results-imoji"}>
                    <img src={
                        props.results.grade === "ONE" ?
                            sadImoji
                        : props.results.grade === "TWO" ?
                            happyImoji
                        :
                            inLoveImoji
                    }/>
                    {
                        props.results.grade === "ONE" ?
                            <h2>Μπορείς και καλύτερα</h2>
                        : props.results.grade === "TWO" ?
                            <h2>Μια χαρά</h2>
                        :
                            <h2>Τέλεια!</h2>
                    }

                    <div className={"stars"}>
                        {
                            props.results.grade === "ONE" ?
                                <>
                                    <StarSvg/>
                                </>
                            : props.results.grade === "TWO" ?
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
                </div>

                {Validate.isArrayEmpty(getWrongAttempts()) ? "" : (
                    <h2 className={"wrong-answers"}>Λανθασμένες απαντήσεις</h2>
                )}

                <div className="errors">
                    {getWrongAttempts().map((wrongAttempt, index)=>{
                        return <>
                            <Question
                                index = {index}
                                question = {wrongAttempt.question}
                                wrongAnswer = {wrongAttempt.answer}
                                correctAnswer = {wrongAttempt.question.correctAnswer}
                                setProgressPercentage={()=>{}}
                            />
                        </>
                    })}
                </div>

                {props.results.percentage >= 0.5 ? (
                    <SubmitButton
                        callback={()=>{
                            Progress.markTestAsRead(
                                props.idChapter,
                                props.results.grade,
                                (response)=>{
                                    if(!response.data){
                                        window.location.href="/";
                                    }else{
                                        setShowFinishModal(true);
                                    }
                                },
                                ()=>{
                                    alert("error")
                                }
                            )
                        }}
                        id={"next_step_button"}
                        text={"Συνέχεια"}
                    />
                ):(
                    <SubmitButton
                        callback={()=>{
                            window.location.reload();
                        }}
                        id={"retry_button"}
                        text={"Ξαναπροσπάθησε"}
                    />
                )}


                {!showFinishModal ? "" : (
                    <>
                        <div className={"finish-modal"}>
                            <img src={trophyImg}/>
                            <h2>Συγχαρητήρια</h2>
                            <span>Πλέον ξέρεις Java!!!</span>
                            <SubmitButton
                                callback={()=>{
                                    window.location.href="/";
                                }}
                                id={"next_step_button"}
                                text={"Συνέχεια"}
                            />
                        </div>
                    </>
                )}

            </>
        )}
    </div>
}