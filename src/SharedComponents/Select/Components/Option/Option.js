import Validate from "../../../../Classes/Validate";
import React from "react";

export default function Option(props){
    return <>
        {"placeholder" in props.option && props.option.placeholder?"":
            (
                <div className="option"
                     onClick={() => { props.selectOption(props.option);}}
                >
                    {Validate.isEmpty(props.option.svg)?"":(
                        <img src={Validate.isEmpty(props.option.svg) ? "" : props.option.svg} />
                    )}
                    <span>
                        {props.option.name}
                    </span>
                </div>
            )
        }
    </>
}