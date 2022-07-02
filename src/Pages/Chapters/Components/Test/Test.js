import React, {useEffect, useState} from "react";

export default function Test(props) {


    function isChapterCurrent(){
        if(
            props.progress.nextObjectId === props.chapter.idChapter &&
            props.progress.nextObjectType === "TEST"
        ){
            return true;
        }
        return false;
    }

    function isChapterPassed(){
        props.progress.chaptersPassed.map((chapterPassed)=>{
            if(chapterPassed.id === props.chapter.id){
                return true;
            }
        })
        return false;
    }


    function isReachable(){
        return isChapterCurrent() || isChapterPassed();
    }


    return <>
        <div
            key={`chapter-${props.chapter.id}`}
            className={`chapter test ${isChapterCurrent()?"current":isChapterPassed()?"passed":"not-reachable"}`}
            style={{
                top: props.position.top,
                left: `calc(${props.backgroundImageLeft}vw + ${props.position.left})`,
            }}
            onClick={()=>{
                if(isReachable()){
                    window.location.href = `/subchapter/${props.chapter.id}`
                }
            }}
        >
        </div>
    </>
}