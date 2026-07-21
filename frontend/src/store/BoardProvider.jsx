import { useReducer, useState } from "react";
import boardContext from "./board-context"
import rough from "roughjs/bin/rough"
import { createRoughElement, getSvgPathFromStroke, isPointNearElement } from "../utils/element";
import getStroke from "perfect-freehand";

const gen = rough.generator();

const initialBoardState = {
    activeToolItem: "BRUSH",
    currentActionType: "NONE",
    elements : [],
    history : [[]],
    index : 0
}

const boardReducer = (state, action) => {
    switch (action.type){
        case "CHANGE_TOOL": {
            return {...state, activeToolItem : action.payload.toolItem}
        }  

        case "CHANGE_CURRENT_ACTION_TYPE": {
            return {...state, currentActionType : action.payload.currentAction}
        }  

        case "DRAW_DOWN": {
            const {clientX,clientY,stroke,fill, size} = action.payload;
            const newElement = createRoughElement(state.elements.length, clientX, clientY, clientX, clientY, {
                type: state.activeToolItem,
                stroke,
                fill,
                size
            });
            const prevElements = state.elements;
            return {...state, elements: [...prevElements, newElement]};
        } 
            
        case "DRAW_MOVE": {
            const {clientX, clientY,stroke,fill, size} = action.payload;
            const newElements = [...state.elements];
            const index = state.elements.length-1;
            const { x1, y1 } = newElements[index];
            const type = state.activeToolItem;
            switch (type) {
                case "BRUSH":
                    newElements[index].points = [
                        ...(newElements[index].points || []),
                        { x: clientX, y: clientY }
                    ];
                    newElements[index].path = new Path2D(
                        getSvgPathFromStroke(getStroke(newElements[index].points))
                    );
                    break;
            
                default:
                    newElements[index] = createRoughElement(
                        index,
                        x1,
                        y1,
                        clientX,
                        clientY,
                        {
                            type,
                            stroke,
                            fill,
                            size
                        }
                    );
                    break;
            }

            return {...state, elements: newElements};
        }

        case "DRAW_UP": {
            const elementsCopy = [...state.elements];
            if(state.index===state.history.length-1){
                return {...state, 
                    currentActionType: "NONE",
                    history : [...state.history, elementsCopy],
                    index: state.index+1
                };
            }else{
                const trimmedHistory = state.history.slice(0,state.index+1);
                return {...state,
                    currentActionType: "NONE",
                    history : [...trimmedHistory, elementsCopy],
                    index: state.index+1
                }
            }
        }

        case "CHANGE_TEXT" : {
            const newElements = [...state.elements];
            newElements[newElements.length -1] = {
                ...newElements[newElements.length -1],
                text: action.payload.text,
            };

            return {...state, elements : newElements, currentActionType: "NONE"};
        }

        case "ERASE": {
            const {clientX, clientY} = action.payload;
            let newElements = [...state.elements];
            newElements = newElements.filter((element) => {
                return !isPointNearElement(element, clientX, clientY);
            });

            return {...state, elements : newElements};
        }

        case "UNDO": {
            if(state.index==0) return state;
            return {...state,
                index: state.index-1,
                elements : [...state.history[state.index-1]]
            }
        }

        case "REDO": {
            if(state.index+1>=state.history.length) return state;
            return {...state,
                index: state.index+1,
                elements : [...state.history[state.index+1]]
            }
        }
        
        default :
            return state; 
    }
};

const BoardProvider = ({ children, initialElements = [] }) => {
    // const [activeToolItem, setActiveToolItem]  = useState("LINE");
    // const [elements, setElements] = useState([]);
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, {
        ...initialBoardState,
        elements: initialElements,
        history: [initialElements]
    });

    const changeToolHandler = (toolItem) => {
        dispatchBoardAction({
            type: "CHANGE_TOOL",
            payload : {
                toolItem
            }
    });
    }

    const boardMouseDownHandler = (event, toolboxState)=> {
        if(boardState.currentActionType === "WRITING") return;
        if(boardState.activeToolItem === "ERASER"){
            dispatchBoardAction({
                type : "CHANGE_CURRENT_ACTION_TYPE",
                payload : {
                    currentAction : "ERASING"
                }
            });
        }else{
            const {clientX, clientY} = event;
            dispatchBoardAction({
                type : "DRAW_DOWN",
                payload : {
                    clientX,
                    clientY,
                    stroke : toolboxState[boardState.activeToolItem]?.stroke,
                    fill : toolboxState[boardState.activeToolItem]?.fill,
                    size : toolboxState[boardState.activeToolItem]?.size,
                }
            });
            
            if(boardState.activeToolItem === "TEXT"){
                dispatchBoardAction({
                    type : "CHANGE_CURRENT_ACTION_TYPE",
                    payload : {
                        currentAction : "WRITING"
                    }
                });
            }else{
                dispatchBoardAction({
                    type : "CHANGE_CURRENT_ACTION_TYPE",
                    payload : {
                        currentAction : "DRAWING"
                    }
                });
            }
        }
    };

    const boardMouseMoveHandler = (event, toolboxState) => {
        const {clientX, clientY} = event;
        if(boardState.activeToolItem === "ERASER"){
            dispatchBoardAction({
                type : "ERASE",
                payload : {
                    clientX,
                    clientY,
                }
            });
        }else{
            dispatchBoardAction({
                type : "DRAW_MOVE",
                payload : {
                    clientX,
                    clientY,
                    stroke : toolboxState[boardState.activeToolItem]?.stroke,
                    fill : toolboxState[boardState.activeToolItem]?.fill,
                    size : toolboxState[boardState.activeToolItem]?.size,
                }
            });
        }
    };

    const boardMouseUpHandler = ()=> {
        if(boardState.currentActionType==="WRITING"){
            return;
        }
         if(boardState.currentActionType==="DRAWING" || boardState.currentActionType==="ERASING"){
            dispatchBoardAction({
                type : "DRAW_UP"
            });
        }
        dispatchBoardAction({
            type: "CHANGE_CURRENT_ACTION_TYPE",
            payload : {
                currentAction: "NONE"
            }
        });
    };

    const textAreaBlurHandler = (text, toolboxState) => {
        const {stroke, size} = toolboxState[boardState.activeToolItem];
        dispatchBoardAction({
            type : "CHANGE_TEXT",
            payload : {
                text,
                stroke,
                size
            }
        })
        dispatchBoardAction({
                type : "DRAW_UP"
        });
        dispatchBoardAction({
            type: "CHANGE_CURRENT_ACTION_TYPE",
            payload : {
                currentAction: "NONE"
            }
        });
    };

    const undoHandler = () => {
        dispatchBoardAction({
            type : "UNDO"
        })
    };

    const redoHandler = (text, toolboxState) => {
        dispatchBoardAction({
            type : "REDO"
        })
    };

    const downloadClickHandler = () => {
        const canvas = document.getElementById("canvas");
        const data = canvas.toDataURL("image/png"); 
        const anchor =  document.createElement("a");
        anchor.href = data;
        anchor.download = "board.png";
        anchor.click();
    };

    const boardContextValue = {
        activeToolItem: boardState.activeToolItem,
        currentActionType: boardState.currentActionType,        
        changeToolHandler,
        elements: boardState.elements,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        downloadClickHandler,
        history: boardState.history,
        index: boardState.index,
        undoHandler, 
        redoHandler
    }

    return (
        <boardContext.Provider value={boardContextValue}>
            {children}
        </boardContext.Provider>
    );
};

export default BoardProvider;