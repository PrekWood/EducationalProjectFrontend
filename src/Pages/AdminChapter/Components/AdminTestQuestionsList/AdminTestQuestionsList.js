import React, {useEffect, useState} from "react";
import {ReactComponent as AddSvg} from "../../imgs/add.svg";
import Validate from "../../../../Classes/Validate";
import AdminSubChapter from "../AdminSubChapter/AdminSubChapter";
import AdminTestQuestion from "../AdminTestQuestion/AdminTestQuestion";

export default function AdminTestQuestionsList(props) {

    function addTestQuestion() {
        window.location.href = `/admin/chapter/${props.chapter.id}/test/new`;
    }

    return <>
        <div className={"test-questions-list"}>
            <div className={"header"}>
                Ερωτησεις Test
                <button className={"add-button"} onClick={() => {
                    addTestQuestion()
                }}>
                    <AddSvg/>
                </button>
            </div>
            <div className={"chapter-admin-list"}>
                {props.chapter.testQuestions.map((question) => {
                    return <>
                        <AdminTestQuestion
                            question={question}
                            hydrateChapter={props.hydrateChapter}
                        />
                    </>
                })}
            </div>
        </div>
    </>
}