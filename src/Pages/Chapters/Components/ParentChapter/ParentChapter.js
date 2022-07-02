import React, {useEffect, useState} from "react";

export default function ParentChapter(props) {

    function isChapterCurrent(){
        if(
            props.progress.nextObjectId === props.chapter.id &&
            props.progress.nextObjectType === "CHAPTER"
        ){
            return true;
        }
        if(props.progress.nextObjectId == null && props.parentIndex === 1){
            return true;
        }
        return false;
    }

    function isChapterPassed(){
        let isPassed = false;
        props.progress.chaptersPassed.map((chapterPassed)=>{
            if(
                chapterPassed.idObject === props.chapter.id &&
                chapterPassed.objectType === "CHAPTER"
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
            key={`parent-chapter-${props.chapter.id}`}
            className={`chapter parent ${isChapterCurrent()?"current":isChapterPassed()?"passed":"not-reachable"}`}
            style={{
                top: props.position.top,
                left: `calc(${props.backgroundImageLeft}vw + ${props.position.left})`,
            }}
            onClick={()=>{
                if(isReachable()){
                    window.location.href = `/chapter/${props.chapter.id}`
                }
            }}
        >
            <span>
                {props.parentIndex}
            </span>
        </div>
    </>
}