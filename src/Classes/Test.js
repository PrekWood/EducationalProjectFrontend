import Model from "./Model";
import axios from "axios";
import User from "./User";

export default class Test extends Model {

    constructor() {
        super();
        this.idChapter = null;
        this.questions = null;
        this.answers = null;
    }

    static castToTest(test) {
        const testObj = new Test();
        testObj.idChapter = test.idChapter;
        testObj.questions = test.questions;
        testObj.answers = test.answers;
        return testObj;
    }

    static getDetails(idChapter, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/test/${idChapter}/`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    submitTest(successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'post',
            url: `${window.API_URL}/test/${this.idChapter}/`,
            headers: this.getHeaders(user.token),
            data:{
                answers: this.answers
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}
