import React, {useEffect, useState} from "react";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ContentState from "draft-js/lib/ContentState";
import Validate from "../../Classes/Validate";

export default function HtmlEditor(props) {

    function getDefaultState(){
        if ("defaultValue" in props && Validate.isNotEmpty(props.defaultValue)) {
            return EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(props.defaultValue)
                )
            )
        }
        return EditorState.createEmpty();
    }

    useEffect(()=>{
        if ("defaultValue" in props && Validate.isNotEmpty(props.defaultValue)) {
            setEditorState(EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(props.defaultValue)
                )
            ))
        }
    },[props.defaultValue])

    const [editorState, setEditorState] = useState(getDefaultState());

    function onEditorStateChange(editorState) {
        setEditorState(editorState)
    }

    return <>
        <div className={`form-field html-editor`} >
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState)=>{
                    setEditorState(editorState)
                }}
            />
            <textarea
                id={props.id}
                style={{display:"none"}}
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            ></textarea>
            <label>
                {props.name}
            </label>
        </div>
    </>
}