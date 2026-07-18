import { useReducer } from "react";
import registerContext from "./register-context";

const initialRegisterState = {
    email : "",
    username : "",
    password : ""
}

const registerReducer = (state, action) => {
    switch (action.type){
        case "UPDATE_STATE": {
            return action.payload;
        }  
        
        default :
            return state; 
    }
};

const RegisterProvider = ({children}) => {
    const [registerState, dispatchRegisterAction] = useReducer(registerReducer, initialRegisterState);

    const updateRegisterContext = ({email, username, password}) => {
        dispatchRegisterAction({
            type : "UPDATE_STATE",
            payload : {
                email : email,
                username : username,
                password : password
            }
        });
    }

    const registerContextValue = {
        registerState,
        updateRegisterContext
    };

    return (
        <registerContext.Provider value={registerContextValue}>
            {children}
        </registerContext.Provider>
    );
};

export default RegisterProvider;