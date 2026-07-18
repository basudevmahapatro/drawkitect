import { createContext } from "react";

const registerContext = createContext ({ 
    email : "",
    updateRegisterContext : () => {}
}
);

export default registerContext;