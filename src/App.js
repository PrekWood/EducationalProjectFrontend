import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Chapters from "./Pages/Chapters/Chapters";
import "./App.css"

import Authentication from "./Pages/Authentication/Authentication";
import AdminChaptersList from "./Pages/AdminChaptersList/AdminChaptersList";
import AdminChapter from "./Pages/AdminChapter/AdminChapter";
import AdminNewTestQuestion from "./Pages/AdminNewTestQuestion/AdminNewTestQuestion";
import AdminNewSubChapter from "./Pages/AdminNewSubChapter/AdminNewSubChapter";
import AdminNewChapter from "./Pages/AdminNewChapter/AdminNewChapter";
import ChapterPage from "./Pages/Chapter/ChapterPage";
import AdminUpdateChapter from "./Pages/AdminUpdateChapter/AdminUpdateChapter";
import SubChapterPage from "./Pages/SubChapterPage/SubChapterPage";

window.API_URL = "http://localhost:8080/api";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/*Admin routes*/}
                    <Route exact path='/admin' element={< AdminChaptersList/>}></Route>
                    <Route exact path='/admin/chapter/new' element={< AdminNewChapter/>}></Route>
                    <Route exact path='/admin/chapter/:idChapter' element={< AdminChapter/>}></Route>
                    <Route exact path='/admin/chapter/:idChapter/update' element={< AdminUpdateChapter/>}></Route>
                    <Route exact path='/admin/chapter/:idChapter/test/new' element={< AdminNewTestQuestion/>}></Route>
                    <Route exact path='/admin/chapter/:idChapter/subChapter/new'
                           element={< AdminNewSubChapter/>}></Route>

                    {/*Front Routes*/}
                    <Route exact path='/login' element={< Authentication/>}></Route>
                    <Route exact path='/' element={< Chapters/>}></Route>
                    <Route exact path='/chapter/:idChapter' element={< ChapterPage/>}></Route>
                    <Route exact path='/subchapter/:idSubChapter' element={< SubChapterPage/>}></Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
