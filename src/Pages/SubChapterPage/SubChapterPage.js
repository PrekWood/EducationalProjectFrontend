import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./SubChapterPage.css";
import User from "../../Classes/User";
import {ReactComponent as BackSvg} from "./imgs/back.svg";
import Validate from "../../Classes/Validate";
import SubChapter from "../../Classes/SubChapter";
import TestQuestion from "../../Classes/TestQuestion";
import Chapter from "../../Classes/Chapter";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Progress from "../../Classes/Progress";

export default function SubChapterPage() {
    // URL Param
    let {idSubChapter} = useParams();

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

    // ChapterPage
    const [subChapter, setSubChapter] = useState(new Chapter());
    function hydrateSubChapter() {
        SubChapter.getDetails(
            idSubChapter,
            (response) => {
                const subChapter = response.data;
                if (Validate.isEmpty(subChapter)) {
                    setSubChapter(null)
                    return;
                }
                const subChapterObj = SubChapter.castToSubChapter(subChapter)
                setSubChapter(subChapterObj);
            }, () => {
                alert('error');
            }
        )
    }
    useEffect(() => {
        hydrateSubChapter();
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
                    <h1>{subChapter.name}</h1>
                </div>

                <span className={"desc"}>
                    {subChapter.theory}
                </span>

                <span className={"examples"}>
                    <span className={"headline"}>Παράδειγμα</span>
                    {subChapter.examples}
                </span>

                <SubmitButton
                    callback={()=>{
                        Progress.markSubChapterAsRead(
                            subChapter,
                            ()=>{
                                window.location.href=`/`;
                            }
                        );
                    }}
                    id={"next_step_button"}
                    text="Ενημέρωση"
                />
            </div>
        </div>
    </>
}