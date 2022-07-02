import React, { useEffect, useState } from 'react';
import './LoadingAnimation.css';

function LoadingAnimation(props) {
    const [state, setState] = useState("inactive");

    useEffect(() => {
        setState(props.state ? "active" : "inactive")
    }, [props.state]);

    return <>
        <div className={`loading-animation ${state}`}>
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </>
}
export default LoadingAnimation;