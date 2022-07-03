import React, {useEffect, useState} from "react";
import Answer from "../Answer/Answer";

import {ReactComponent as RedFlagSvg} from "./../../imgs/red-flag.svg";
import {ReactComponent as OrangeFlagSvg} from "./../../imgs/orange-flag.svg";
import {ReactComponent as GreenFlagSvg} from "./../../imgs/green-flag.svg";
import Validate from "../../../../Classes/Validate";

export default function Question(props) {

    const [isSelected, setSelected] = useState(false);

    function setFirstValue() {
        if (!isSelected) {
            props.setProgressPercentage(((p) => p + Math.round(100 / props.questions.length)))
            setSelected(true);
        }
    }

    return <div className={"container question"}>
        <span className={"question-test"}>{props.index + 1}) {props.question.question} </span>
        <div className={"answer-list"}>
            {props.question.answerList.map((answer) => {
                return <React.Fragment key={`test-answer-${answer.id}`}>
                    <Answer
                        question={props.question}
                        answer={answer}
                        wrong={!Validate.isEmpty(props.wrongAnswer) && props.wrongAnswer.id === answer.id}
                        correct={!Validate.isEmpty(props.correctAnswer) && props.correctAnswer.id === answer.id}
                        setFirstValue={setFirstValue}
                    />
                </React.Fragment>
            })}
        </div>
        <div className={`difficulty-flag ${props.question.difficulty}`}>
            {props.question.difficulty === "MEDIUM" ?
                <OrangeFlagSvg/>
            : props.question.difficulty === "EASY" ?
                <GreenFlagSvg/>
            :
                <RedFlagSvg/>
            }
        </div>
    </div>
}