import axios from "axios";
import Validate from "./Validate";
import Model from "./Model";
import Progress from "./Progress";

export default class User extends Model {

    constructor() {
        super();
        this.id = null;
        this.email = null;
        this.token = null;
        this.password = null;
        this.firstName = null;
        this.lastName = null;
        this.isAdmin = null;
        this.progress = new Progress();
    }

    static castToUser(user) {
        const userObj = new User();
        userObj.id = user.id;
        userObj.email = user.email;
        userObj.token = user.token;
        userObj.password = user.password;
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.isAdmin = user.isAdmin;
        userObj.progress = user.progress;
        return userObj;
    }

    login(successMethod, errorMethod, registerResponse = null) {
        console.log(`${window.API_URL}/login?username=${this.email}&password=${this.password}`);
        axios({
            method: 'post',
            url: `${window.API_URL}/login?username=${this.email}&password=${this.password}`,
            headers: this.getHeaders(),
        }).then(function (response) {
            console.log(response)
            if (registerResponse != null) {
                response.registerResponse = registerResponse;
            }
            successMethod(response);
        }).catch(function (error) {
            console.log(error)
            errorMethod(error);
        });
    }

    register(successMethod, errorMethod) {
        const thisUser = this;


        // First Register
        axios({
            method: 'post',
            url: `${window.API_URL}/user`,
            headers: this.getHeaders(),
            data: {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
            }
        }).then(function (response) {
            // Then Login
            thisUser.login(successMethod, errorMethod, response)
        }).catch(function (error) {
            console.log(error);
            errorMethod(error);
        });
    }

    saveUserToLocalStorage() {
        localStorage.setItem("loggedInUser", JSON.stringify(this));
    }

    static loadUserFromLocalStorage() {
        let loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser == null || loggedInUser == "" || loggedInUser == undefined) {
            return new User();
        }

        let loggedInUserJson = null;
        try {
            loggedInUserJson = JSON.parse(loggedInUser);
        } catch (e) {
            return new User();
        }

        if (loggedInUserJson == null) {
            return new User();
        }

        const userToReturn = new User();
        for (const property in loggedInUserJson) {
            userToReturn[property] = loggedInUserJson[property];
        }
        return userToReturn;
    }

    logout(successMethod, errorMethod) {
        localStorage.setItem("loggedInUser", null);
    }

    getUserDetails(successMethod, errorMethod) {
        axios({
            method: 'get',
            url: `${window.API_URL}/user/`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    getUserDetailsWithAdminPrivileges(successMethod, errorMethod) {
        axios({
            method: 'get',
            url: `${window.API_URL}/user/`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            const loggedInUser = User.castToUser(response.data)
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    update(successMethod, errorMethod) {
        axios({
            method: 'put',
            url: `${window.API_URL}/user`,
            headers: this.getHeaders(this.token),
            data:{
                firstName:this.firstName,
                lastName:this.lastName,
                email:this.email,
                year:this.year,
                gender:this.gender
            }
        }).then(function (response) {
            if(!response.data.isAdmin){
                throw "Not Admin";
            }
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    getMostCommonErrorType(successMethod, errorMethod) {
        axios({
            method: 'get',
            url: `${window.API_URL}/user/errors-statistics`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

}