import React, {useEffect, useState} from "react";

export default function Answer(props) {

    return <div className={`answer ${props.wrong?"wrong":""} ${props.correct?"correct":""}`}>
        <input
            type={"radio"}
            name={`question-${props.question.id}`}
            id={`answer_${props.answer.id}`}
            data-answer-id={props.answer.id}
            data-question-id={props.question.id}
            onChange={()=>{
                props.setFirstValue();
            }}
            defaultChecked={props.correct}
        />
        <label htmlFor={`answer_${props.answer.id}`}> {props.answer.answer}</label>
    </div>
}