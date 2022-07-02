import React, {useEffect, useState} from "react";
import {ReactComponent as ButtonNavLSvg} from "../../imgs/buttonNavigationL.svg";
import {ReactComponent as ButtonNavRSvg} from "../../imgs/buttonNavigationR.svg";

export default function ButtonNavigation(props){

    const [buttonNavigationInterval, setButtonNavigationInterval] = useState([]);

    function moveRight(){
        let tmpLeft = props.backgroundImageLeft;
        const interval = setInterval(() => {
            if(tmpLeft < 0){
                props.setBackgroundImageLeft((backgroundImageLeft) => backgroundImageLeft + 1);
                tmpLeft += 1;
            }
        }, 20)
        setButtonNavigationInterval(interval);
    }

    function moveLeft(){
        const backgroundImgRatio = 4656/1588;
        const backgroundImgWidthInPx = window.innerHeight*backgroundImgRatio;
        const backgroundImgWidthInVw = (backgroundImgWidthInPx * 100) / window.innerWidth;
        const endOfBackgroundLeft = -(backgroundImgWidthInVw - 100 - 1)
        let tmpLeft = props.backgroundImageLeft;
        const interval = setInterval(() => {
            if(tmpLeft > endOfBackgroundLeft){
                props.setBackgroundImageLeft((backgroundImageLeft) => backgroundImageLeft - 1);
                tmpLeft -= 1;
            }
        }, 20)
        setButtonNavigationInterval(interval);
    }

    return <>
        <div className={"button-navigation"}>
            <ButtonNavLSvg
                onMouseDown={()=>{
                    moveRight();
                }}
                onMouseUp={()=>{
                    clearInterval(buttonNavigationInterval);
                }}
            />
            <ButtonNavRSvg
                onMouseDown={()=>{
                    moveLeft();
                }}
                onMouseUp={()=>{
                    clearInterval(buttonNavigationInterval);
                }}
            />
        </div>
    </>
}