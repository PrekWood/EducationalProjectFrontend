import React, {useEffect, useState} from "react";
import "./Chapters.css";
import chaptersSvg from "./imgs/chaptersSvg.svg";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import {ReactComponent as InfoSvg} from "./imgs/info.svg";
import ChapterList from "./Components/ChapterList/ChapterList";
import User from "../../Classes/User";
import Chapter from "../../Classes/Chapter";
import Validate from "../../Classes/Validate";
import ButtonNavigation from "./Components/ButtonNavigation/ButtonNavigation";
import SubmitButton from "../../SharedComponents/SubmitButton/SubmitButton";
import Help from "../../SharedComponents/Help/Help";

export default function Chapters(){

    const [backgroundImageLeft, setBackgroundImageLeft] = useState(0);

    // User
    const [user, setUser] = useState(new User());
    useEffect(() => {
        // Load user
        const user = User.loadUserFromLocalStorage();
        // check if token is not expired
        user.getUserDetails(
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


    // Chapters
    const [chapters, setChapters] = useState([]);
    useEffect(()=>{
        Chapter.getChapters((response)=>{
            const chapterList = response.data;
            if (Validate.isEmpty(chapterList) || Validate.isArrayEmpty(chapterList)) {
                setChapters([])
                return;
            }

            let chapterListObj = [];
            for (let chapterListIndex = 0; chapterListIndex < chapterList.length; chapterListIndex++) {
                chapterListObj.push(Chapter.castToChapter(chapterList[chapterListIndex]))
            }
            setChapters(chapterListObj)
        },()=>{
            alert("error");
        })
    },[])

    // Formatted Chapters
    const [formattedChapters, setFormattedChapters] = useState([]);
    useEffect(() => {
        let tmpFormattedChapters = [];
        for (let parentChapterIndex = 0; parentChapterIndex < chapters.length; parentChapterIndex++) {
            // Add parent
            let parentChapter = chapters[parentChapterIndex];
            if (parentChapter !== undefined && parentChapter != null) {
                parentChapter.type = "CHAPTER";
                tmpFormattedChapters.push(parentChapter);
            }

            // Add subchapters
            for (let childChapterIndex = 0; childChapterIndex < parentChapter.subChapters.length; childChapterIndex++) {
                let childChapter = parentChapter.subChapters[childChapterIndex];
                if (childChapter !== undefined && childChapter != null) {
                    childChapter.type = "SUBCHAPTER";
                    tmpFormattedChapters.push(childChapter);
                }
            }
            // Add a test
            tmpFormattedChapters.push({
                type: "TEST",
                idChapter: parentChapter.id
            });
        }

        setFormattedChapters(tmpFormattedChapters);
    }, [chapters])


    function scrollAction(e){
        const backgroundImgRatio = 4656/1588;
        const backgroundImgWidthInPx = window.innerHeight*backgroundImgRatio;
        const backgroundImgWidthInVw = (backgroundImgWidthInPx * 100) / window.innerWidth;
        const endOfBackgroundLeft = -(backgroundImgWidthInVw - 100 - 1)

        if(e.deltaY < 0){
            if(backgroundImageLeft < 0){
                setBackgroundImageLeft((backgroundImageLeft) => backgroundImageLeft + 1);
            }
        }else{
            if(backgroundImageLeft > endOfBackgroundLeft) {
                setBackgroundImageLeft((backgroundImageLeft) => backgroundImageLeft - 1);
            }
        }
    }

    function goToNextChapter() {
        if(Validate.isArrayEmpty(formattedChapters)){
            return;
        }

        for(let chapterIndex=0; chapterIndex < formattedChapters.length; chapterIndex++){
            let chapter = formattedChapters[chapterIndex];
            if(
                user.progress.nextObjectType === chapter.type &&
                user.progress.nextObjectType === "CHAPTER" &&
                user.progress.nextObjectId === chapter.id
            ){
                window.location.href=`/chapter/${chapter.id}`
            }
            if(
                user.progress.nextObjectType === chapter.type &&
                user.progress.nextObjectType === "SUBCHAPTER" &&
                user.progress.nextObjectId === chapter.id
            ){
                window.location.href=`/subchapter/${chapter.id}`
            }
            if(
                user.progress.nextObjectType === chapter.type &&
                user.progress.nextObjectType === "TEST" &&
                user.progress.nextObjectId === chapter.idChapter
            ){
                window.location.href=`/test/${chapter.idChapter}`
            }
        }
    }

    const [mostCommonErrorType, setMostCommonErrorType] = useState(null);
    useEffect(()=>{
        if(Validate.isEmpty(user) || user.isEmpty()){
            return;
        }
        user.getMostCommonErrorType(
            (resp)=>{
                const errorType = resp.data
                let errorTypeText = null;
                switch (errorType){
                    case "SYNTACTICAL":
                        errorTypeText = "Συντακτικά"
                        break;
                    case "LOGICAL":
                        errorTypeText = "Λογικής"
                        break;
                    case "CARELESSNESS":
                        errorTypeText = "Απροσεξίας"
                        break;
                    case "MISSPELLING":
                        errorTypeText = "Ορθογραφικα"
                        break;
                    default:
                        errorTypeText = null
                        break;
                }

                if(errorTypeText == null){
                    return;
                }

                setMostCommonErrorType(errorTypeText);
            }
        )
    },[user])

    return <>
        <div
            className={"chapters-container"}
            style={{
                backgroundImage: `url(${chaptersSvg})`,
                backgroundPositionX: `${backgroundImageLeft}vw`
            }}
            onWheel={scrollAction}
        >
            <button id="logout_button" onClick={logout}>
                <LogoutSvg />
            </button>

            <ChapterList
                user={user}
                chapters={chapters}
                backgroundImageLeft={backgroundImageLeft}
                formattedChapters={formattedChapters}
            />

            <ButtonNavigation
                backgroundImageLeft={backgroundImageLeft}
                setBackgroundImageLeft={setBackgroundImageLeft}
            />

            <SubmitButton
                id={"play_next_chapter"}
                text={"Συνέχεια"}
                callback={goToNextChapter}
            />

            {Validate.isEmpty(mostCommonErrorType) ? "" :(
                <>
                    <div className={"most-common-error-type-popup"}>
                        <InfoSvg/>
                        Έχουμε παρατηρήσει πως κάνεις πολλά λάθη {mostCommonErrorType}.
                        Προσπάθησε να τα βελτιώσεις
                    </div>
                </>
            )}
        </div>

        <Help page={7}/>
    </>
}