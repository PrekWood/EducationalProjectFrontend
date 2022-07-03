import axios from "axios";
import Validate from "./Validate";
import Model from "./Model";
import User from "./User";

export default class Progress extends Model {

    constructor() {
        super();
        this.chaptersPassed = [];
        this.nextObjectId = null;
        this.nextObjectType = null;
        // this.idCurrentChapter = null;
        // this.idCurrentSubChapter = null;
    }

    static castToProgress(progress) {
        const progressObj = new Progress();
        progressObj.chaptersPassed = progress.chaptersPassed;
        progressObj.nextObjectId = progress.nextObjectId;
        progressObj.nextObjectType = progress.nextObjectType;
        // progressObj.idCurrentChapter = progress.idCurrentChapter;
        // progressObj.idCurrentSubChapter = progress.idCurrentSubChapter;
        return progressObj;
    }

    static markAsRead(chapter, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'put',
            url: `${window.API_URL}/progress/chapter/${chapter.id}/`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static markSubChapterAsRead(subChapter, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'put',
            url: `${window.API_URL}/progress/subchapter/${subChapter.id}/`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
    static markTestAsRead(idChapter, grade, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'put',
            url: `${window.API_URL}/progress/test/${idChapter}/?grade=${grade}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}