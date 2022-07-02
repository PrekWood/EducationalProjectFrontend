import Model from "./Model";
import axios from "axios";
import User from "./User";

export default class TestAnswer extends Model {
    constructor(id=null,answer="") {
        super();
        this.id = id;
        this.dateAdd = null;
        this.answer = answer;
        this.correct = false;
    }

    static castToTestAnswer(testAnswer) {
        const testAnswerObj = new TestAnswer();
        testAnswerObj.id = testAnswer.id;
        testAnswerObj.dateAdd = testAnswer.dateAdd;
        testAnswerObj.answer = testAnswer.answer;
        return testAnswerObj;
    }
}