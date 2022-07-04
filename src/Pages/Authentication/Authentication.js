import React, {useEffect, useState} from "react";

import "./Authentication.css"
import LoginForm from "./Components/LoginForm/LoginForm";
import RegisterForm from "./Components/RegisterForm/RegisterForm";
import Validate from "../../Classes/Validate";
import backgroundImg from "./imgs/backgroundImg.png";
import Help from "../../SharedComponents/Help/Help";

export default function Authentication() {

    const [currentForm, setCurrentForm] = useState("login");
    const [user, setUser] = useState(null);

    useEffect(()=>{
        if(Validate.isNotEmpty(user) && !user.isEmpty()){
            user.saveUserToLocalStorage();
        }
    },[user])

    return (
        <>
            <div className={"Authentication"} style={{
                backgroundImage:`url(${backgroundImg})`
            }}>


                <LoginForm
                    isActive={currentForm==="login"}
                    setCurrentForm={setCurrentForm}
                    setUser={setUser}
                />

                <RegisterForm
                    isActive={currentForm==="register"}
                    setCurrentForm={setCurrentForm}
                    setUser={setUser}
                />

            </div>

            <Help page={3}/>
        </>
    );
}