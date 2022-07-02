
import React, { useEffect } from 'react';
import "./Nav.css";
import logo from "./imgs/logo.png";
import { ReactComponent as SettingsSvg } from "./imgs/settings.svg";
import { ReactComponent as DiagnosisSvg } from "./imgs/diagnosis.svg";
import { ReactComponent as LogoutSvg } from "./imgs/logout.svg";
import TranslatedText from "../TranslatedText/TranslatedText";
import LanguageSelector from "../LanguageSelector/LanguageSelector";


function Nav(props) {

    function logout(){
        props.user.logout();
        window.location.href="/";
    }

    return (
        <>
            <nav>
                <div className={"nav-items"}>
                    <a href="/symptoms" className="nav-item logo-container">
                        <img src={logo} />
                    </a>
                    <a href="/symptoms" className={`nav-item ${window.location.href == (window.FRONTEND_BASE_URL + "/symptoms") ? "active" : ""}`}>
                        <DiagnosisSvg />
                        <span className="nav-text">
                            <TranslatedText
                                text={"DIAGNOSIS"}
                                language={props.language}
                            />
                        </span>
                    </a>
                    <a href="/settings" className={`nav-item ${window.location.href == (window.FRONTEND_BASE_URL + "/settings") ? "active" : ""}`}>
                        <SettingsSvg />

                        <span className="nav-text">
                            <TranslatedText
                                text={"SETTINGS"}
                                language={props.language}
                            />
                        </span>
                    </a>
                    <a className={`nav-item`} onClick={logout}>
                        <LogoutSvg />
                        <span className="nav-text">
                            <TranslatedText
                                text={"LOG OUT"}
                                language={props.language}
                            />
                        </span>
                    </a>
                </div>

                <LanguageSelector
                    setLanguage={props.setLanguage}
                    language={props.language}
                />
            </nav>
        </>
    );
}

export default Nav;

