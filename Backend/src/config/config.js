import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("Couldnt get MONGO_URI from .env file");
}

if(!process.env.GOOGLE_OAUTH_CLIENT_ID){
    throw new Error("Couldnt get GOOGLE_OAUTH_CLIENT_ID from .env file");
}

if(!process.env.GOOGLE_OAUTH_CLIENT_SECRET){
    throw new Error("Couldnt get GOOGLE_OAUTH_CLIENT_SECRET from .env file");
}

if(!process.env.GOOGLE_OAUTH_REFRESH_TOKEN){
    throw new Error("Couldnt get GOOGLE_OAUTH_REFRESH_TOKEN from .env file");
}

if(!process.env.GOOGLE_USER){
    throw new Error("Couldnt get GOOGLE_USER from .env file");
}

if(!process.env.JWT_SECRET){
    throw new Error("Couldnt get JWT_SECRET from .env file");
}

export const config ={
    MONGO_URI : process.env.MONGO_URI,
    GOOGLE_OAUTH_CLIENT_ID : process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET : process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REFRESH_TOKEN : process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    GOOGLE_USER : process.env.GOOGLE_USER,
    JWT_SECRET : process.env.JWT_SECRET,
}
