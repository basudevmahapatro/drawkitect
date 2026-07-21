import { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import rough from 'roughjs';
import boardContext from '../../store/board-context';
import toolboxContext from '../../store/toolbox-context';
import classes from "./index.module.css"

function Board(){
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const {elements, boardMouseDownHandler, boardMouseMoveHandler, currentActionType, boardMouseUpHandler, textAreaBlurHandler,undoHandler,redoHandler}  = useContext(boardContext);
    const {toolboxState} = useContext(toolboxContext);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }, []);

    useEffect(() => {
        if(currentActionType=="WRITING"){
            const focusTimeout = setTimeout(() => {
                textAreaRef.current?.focus();
            }, 0);
        }
    }, [currentActionType]);
    
useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "z") {
            event.preventDefault();
            undoHandler();
        } else if (event.ctrlKey && event.key === "y") {
            event.preventDefault();
            redoHandler();
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
}, [undoHandler, redoHandler]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.save();

        const roughCanvas = rough.canvas(canvas); 

        elements.forEach((element) => {
            switch (element.type) {
                case "BRUSH":
                    context.fillStyle = element.stroke;
                    context.fill(element.path);
                    context.restore();
                    break;
                
                case "LINE":
                case "RECTANGLE":
                case "CIRCLE":
                case "ARROW":
                    roughCanvas.draw(element.roughEle);
                    break;

                case "TEXT":
                    context.textBaseline = "top";
                    context.font = `${element.size}px Caveat`;
                    context.fillStyle = element.stroke;
                    context.fillText(element.text, element.x1, element.y1);
                    context.restore();
                    break;

                default:
                    console.warn("Unknown element type:", element.type);
                    break;
            }
        });

        return () => {
            context.clearRect(0,0,canvas.width,canvas.height);
        };
    }, [elements]);

    const handleMouseDown = (event) => {
        boardMouseDownHandler(event, toolboxState);
    };

    const handleMouseMove = (event) => {
        if(currentActionType=="DRAWING" || currentActionType=="ERASING") boardMouseMoveHandler(event, toolboxState);
    };

    const handleMouseUp = () => {
        boardMouseUpHandler();
    };

    return (
    <div className='app'>
        <>
            {currentActionType === "WRITING" && <textarea
                ref={textAreaRef}
                type="text"
                className = {classes.textElementBox}
                style={{
                    top: elements[elements.length-1].y1,
                    left: elements[elements.length-1].x1,
                    fontSize: `${elements[elements.length-1]?.size}px`,
                    color: elements[elements.length-1].stroke,
                    zIndex: 2,
                }}

                onBlur={(event) => textAreaBlurHandler(event.target.value, toolboxState)}
            />}
            <canvas id='canvas' ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
        </>
    </div>
  )
}

export default Board;