import Model from "./Model";
import axios from "axios";
import User from "./User";

export default class Chapter extends Model {

    constructor() {
        super();
        this.id = null;
        this.name = null;
        this.description = null;
        this.dateAdd = null;
        this.subChapters = [];
        this.testQuestions = [];
        this.bestAttempt = null;
        this.completionRate = null;
        this.subChapterList = null;
    }

    static castToChapter(chapter) {
        const chapterObj = new Chapter();
        chapterObj.id = chapter.id;
        chapterObj.description = chapter.description;
        chapterObj.name = chapter.name;
        chapterObj.dateAdd = chapter.dateAdd;
        chapterObj.subChapters = chapter.subChapters;
        chapterObj.testQuestions = chapter.testQuestions;
        chapterObj.bestAttempt = chapter.bestAttempt;
        chapterObj.completionRate = chapter.completionRate;
        chapterObj.subChapterList = chapter.subChapterList;
        return chapterObj;
    }

    static getChapters(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/chapters`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    create(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'post',
            url: `${window.API_URL}/chapter`,
            headers: this.getHeaders(user.token),
            data:{
                name: this.name,
                description: this.description,
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getDetails(idChapter, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/chapter/${idChapter}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    renameTo(newName, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'put',
            url: `${window.API_URL}/chapter/${this.id}?newName=${newName}`,
            headers: this.getHeaders(user.token)
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    update(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'put',
            url: `${window.API_URL}/chapter/${this.id}/full`,
            headers: this.getHeaders(user.token),
            data:{
                name:this.name,
                description:this.description,
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    delete(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'delete',
            url: `${window.API_URL}/chapter/${this.id}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    addSubChapter(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'post',
            url: `${window.API_URL}/chapter/${this.id}/subchapter`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getNextName(successMethod, errorMethod){
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/chapter/next-name`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

}