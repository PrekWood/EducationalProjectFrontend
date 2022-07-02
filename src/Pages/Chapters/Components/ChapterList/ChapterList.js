import React, {useEffect, useState} from "react";
import Chapter from "../Chapter/Chapter";
import "./ChapterList.css"
import ParentChapter from "../ParentChapter/ParentChapter";
import Test from "../Test/Test";

export default function ChapterList(props) {

    const [chapterPositions, setChapterPositions] = useState([]);
    useEffect(() => {
        const positionsJson = require('./chapter-positions.json');
        setChapterPositions(positionsJson)
    }, [])

    function getChapterPosition(index) {
        if (index > chapterPositions.length - 1) {
            return {
                "left": "0",
                "top": "0"
            };
        }
        return chapterPositions[
            parseInt((index / props.formattedChapters.length) * chapterPositions.length)
        ]
    }

    function getParentIndex(index, formattedChapters) {
        let parentChapterCount = 0;
        for (let chapterIndex = 0; chapterIndex < formattedChapters.length; chapterIndex++) {
            if (formattedChapters[chapterIndex].type === "CHAPTER") {
                parentChapterCount++;
            }
            if (chapterIndex === index) {
                return parentChapterCount;
            }
        }
        return parentChapterCount;
    }

    return <>
        {props.formattedChapters.map((chapter, index) => {
            return <>
                {chapter.type === "CHAPTER" ? (
                    <ParentChapter
                        chapter={chapter}
                        progress={props.user.progress}
                        position={getChapterPosition(index)}
                        parentIndex={getParentIndex(index, props.formattedChapters)}
                        backgroundImageLeft={props.backgroundImageLeft}
                    />
                ) : chapter.type === "SUBCHAPTER" ? (
                    <Chapter
                        chapter={chapter}
                        progress={props.user.progress}
                        position={getChapterPosition(index)}
                        backgroundImageLeft={props.backgroundImageLeft}
                    />
                ) : (
                    <Test
                        chapter={chapter}
                        progress={props.user.progress}
                        position={getChapterPosition(index)}
                        backgroundImageLeft={props.backgroundImageLeft}
                    />
                )}
            </>
        })}
    </>
}