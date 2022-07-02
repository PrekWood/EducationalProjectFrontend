import Model from "./Model";
import axios from "axios";
import User from "./User";

export default class SubChapter extends Model {

    constructor() {
        super();
        this.id = null;
        this.theory = null;
        this.name = null;
        this.idChapter = null;
        this.examples = null;
    }

    static castToSubChapter(user) {
        const subChapterObj = new SubChapter();
        subChapterObj.id = user.id;
        subChapterObj.theory = user.theory;
        subChapterObj.name = user.name;
        subChapterObj.idChapter = user.idChapter;
        subChapterObj.examples = user.examples;
        return subChapterObj;
    }

    static getDetails(idChapter, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/subchapter/${idChapter}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    // static getChapters(successMethod, errorMethod) {
    //     const user = User.loadUserFromLocalStorage();
    //     axios({
    //         method: 'get',
    //         url: `${window.API_URL}/chapters`,
    //         headers: this.getHeaders(user.token),
    //     }).then(function (response) {
    //         successMethod(response);
    //     }).catch(function (error) {
    //         errorMethod(error);
    //     });
    // }


    create(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'post',
            url: `${window.API_URL}/chapter/${this.idChapter}/subchapter`,
            headers: this.getHeaders(user.token),
            data: {
                name:this.name,
                theory:this.theory,
                examples:this.examples,
            }
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
            url: `${window.API_URL}/subchapter/${this.id}/`,
            headers: this.getHeaders(user.token),
            data: {
                name:newName
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
            url: `${window.API_URL}/subchapter/${this.id}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }


}