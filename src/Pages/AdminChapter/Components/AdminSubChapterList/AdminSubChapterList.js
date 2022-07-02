import React, {useEffect, useState} from "react";
import {ReactComponent as AddSvg} from "../../imgs/add.svg";
import Validate from "../../../../Classes/Validate";
import AdminSubChapter from "../AdminSubChapter/AdminSubChapter";

export default function AdminSubChapterList(props) {

    function addSubChapter(){
        props.chapter.addSubChapter(
            ()=>{
                props.hydrateChapter();
            },()=>{
                alert("error")
            }
        )
    }

    return <>
        <div className={"sub-chapters-list"}>
            <div className={"header"}>
                Υποκεφάλαια
                <button className={"add-button"} onClick={()=>{
                    window.location.href=`/admin/chapter/${props.chapter.id}/subChapter/new`;
                }}>
                    <AddSvg/>
                </button>
            </div>
            <div className={"chapter-admin-list"}>
                {Validate.isEmpty(props.chapter) || Validate.isEmpty(props.chapter.subChapters) ? "" :
                    props.chapter.subChapters.map((subChapter) => {
                        return <>
                            <AdminSubChapter
                                subChapter={subChapter}
                                reHydrateListing={props.hydrateChapter}
                            />
                        </>
                    })
                }
            </div>
        </div>
    </>
}