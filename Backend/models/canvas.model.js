import mongoose, { mongo } from "mongoose";

const canvasSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    }, 
    name : {
        type : String,
        required : true,
        trim : true 
    },
    elements : [{
        type: mongoose.Schema.Types.Mixed,

    }],
    sharedWith : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    }]
},{
    timestamps : true
});

canvasSchema.statics.getAllCanvases = async function(userId){
    const canvases = await this.find({ $or : [ { owner : userId }, { sharedWith : userId } ] });
    return canvases;     
};

canvasSchema.statics.createCanvas = async function(userId, canvasName){
    try{
        const canvas = new this({
            owner : userId,
            name : canvasName,
            elements : [],
            sharedWith : []
        });
        const newCanvas = await canvas.save();
        return newCanvas;
    }catch(error){
        throw new Error(error.message);
    }
};

export const canvasModel = mongoose.model("canvases", canvasSchema);