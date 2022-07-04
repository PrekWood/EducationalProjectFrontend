import Model from "./Model";
import axios from "axios";
import User from "./User";

export default class TestQuestion extends Model {
    constructor() {
        super();
        this.id = null;
        this.dateAdd = null;
        this.idChapter = null;
        this.question = null;
        this.type = null;
        this.difficulty = null;
        this.errorType = null;
        this.answers = null;
        this.answerList = [];
        this.chapter = [];
        this.idSubChapter = [];
        this.subChapter = [];
    }

    static castToTestQuestion(testQ) {
        const testQuestion = new TestQuestion();
        testQuestion.id = testQ.id;
        testQuestion.dateAdd = testQ.dateAdd;
        testQuestion.idChapter = testQ.idChapter;
        testQuestion.question = testQ.question;
        testQuestion.type = testQ.type;
        testQuestion.difficulty = testQ.difficulty;
        testQuestion.errorType = testQ.errorType;
        testQuestion.answers = testQ.answers;
        testQuestion.testQuestions = testQ.testQuestions;
        testQuestion.answerList = testQ.answerList;
        testQuestion.chapter = testQ.chapter;
        testQuestion.idSubChapter = testQ.idSubChapter;
        testQuestion.subChapter = testQ.subChapter;
        return testQuestion;
    }

    static getDetails(idQuestion, successMethod, errorMethod) {
        const user = User.loadUserFromLocalStorage();
        axios({
            method: 'get',
            url: `${window.API_URL}/question/${idQuestion}/`,
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
            url: `${window.API_URL}/chapter/${this.idChapter}/question`,
            headers: this.getHeaders(user.token),
            data:{
                "question":this.question,
                "type":this.type,
                "difficulty":this.difficulty,
                "errorType":this.errorType,
                "answers":this.answers,
                "idSubChapter":this.idSubChapter,
            }
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
            url: `${window.API_URL}/question/${this.id}/`,
            headers: this.getHeaders(user.token),
            data:{
                "question":this.question,
                "type":this.type,
                "difficulty":this.difficulty,
                "errorType":this.errorType,
                "answers":this.answers,
                "idSubChapter":this.idSubChapter,
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
            url: `${window.API_URL}/question/${this.id}`,
            headers: this.getHeaders(user.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}