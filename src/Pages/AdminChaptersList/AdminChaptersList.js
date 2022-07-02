import React, {useEffect, useState} from "react";
import "./AdminChaptersList.css";
import User from "../../Classes/User";
import Chapter from "../../Classes/Chapter";
import {ReactComponent as LogoutSvg} from "./imgs/logout.svg";
import {ReactComponent as AddSvg} from "./imgs/add.svg";
import Validate from "../../Classes/Validate";
import AdminChapter from "./Components/AdminChapter/AdminChapter";

export default function AdminChaptersList() {

    const [user, setUser] = useState(null);
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

    const [chapters, setChapters] = useState([]);

    function reHydrateChapters() {
        Chapter.getChapters((response) => {
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
        }, () => {
            alert('error');
        })
        setChapters([])
    }

    useEffect(() => {
        reHydrateChapters();
    }, [])

    function logout() {
        user.logout();
        window.location.href = "/login";
    }


    return <>
        <div className={"AdminChaptersList"}>
            <h1>Όλα τα κεφάλαια</h1>
            <button onClick={logout} className={"logout"}>
                <LogoutSvg/>
                Αποσύνδεση
            </button>
            <div className={"chapters-list"}>
                <div className={"header"}>
                    Κεφάλαια
                    <button className={"add-button"} onClick={()=>{
                        window.location.href = "/admin/chapter/new";
                    }}>
                        <AddSvg/>
                    </button>
                </div>
                <div className={"chapter-admin-list"}>
                    {chapters.map((chapter) => {
                        return <>
                            <AdminChapter
                                key={chapter.id}
                                chapter={chapter}
                                reHydrateChapters={reHydrateChapters}
                            />
                        </>
                    })}
                </div>
            </div>
        </div>
    </>
}