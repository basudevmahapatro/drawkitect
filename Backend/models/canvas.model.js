import mongoose, { mongo } from "mongoose";

const abstractImages = [
    "https://i.pinimg.com/1200x/00/5f/1e/005f1e1951328a71297bd26c67e216a0.jpg",
    "https://i.pinimg.com/1200x/8d/42/2b/8d422bc571a6c769667f10da95202715.jpg",
    "https://i.pinimg.com/1200x/76/e2/71/76e2714f290aa1e8573db52bea60d306.jpg",
    "https://i.pinimg.com/736x/f0/2b/80/f02b809fc8ce8421235709b88a19ab00.jpg",
    "https://i.pinimg.com/736x/e3/e8/7e/e3e87efed34443bb98bf1b6a8526d07c.jpg",
    "https://i.pinimg.com/1200x/d3/9a/0f/d39a0fb186c9a1459fe7e5f8b5b06964.jpg",
    "https://i.pinimg.com/1200x/51/5b/af/515bafb968d23949946341934f6a75da.jpg",
    "https://i.pinimg.com/1200x/2d/a6/55/2da65505e679a7dd32f7e3c598f04cf4.jpg",
    "https://i.pinimg.com/736x/4b/3a/c2/4b3ac2430131e194a1aa109657536bc1.jpg",
    "https://i.pinimg.com/1200x/1c/b9/aa/1cb9aa75a657d1d7b50a8a87d51c6e0a.jpg"
];

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
    imageUrl : {
        type : String,
        default : ""
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
    const canvases = await this.find({ $or : [ { owner : userId }, { sharedWith : userId } ] }).sort({ updatedAt: -1 });
    return canvases;     
};

canvasSchema.statics.createCanvas = async function(userId, canvasName){
    try{
        const randomImageUrl = abstractImages[Math.floor(Math.random() * abstractImages.length)];
        const canvas = new this({
            owner : userId,
            name : canvasName,
            imageUrl : randomImageUrl,
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