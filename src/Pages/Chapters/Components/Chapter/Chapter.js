import React, {useEffect, useState} from "react";

export default function Chapter(props) {



    function isChapterCurrent(){
        if(
            props.progress.nextObjectId === props.chapter.id &&
            props.progress.nextObjectType === "SUBCHAPTER"
        ){
            return true;
        }
        return false;
    }

    function isChapterPassed(){
        let isPassed = false;
        props.progress.chaptersPassed.map((chapterPassed)=>{
            if(
                chapterPassed.idObject === props.chapter.id &&
                chapterPassed.objectType === "SUBCHAPTER"
            ){
                isPassed = true;
            }
        })
        return isPassed;
    }

    function isReachable(){
        return isChapterCurrent() || isChapterPassed();
    }

    return <>
        <div
            key={`chapter-${props.chapter.id}`}
            className={`chapter ${isChapterCurrent()?"current":(isChapterPassed()?"passed":"not-reachable")}`}
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