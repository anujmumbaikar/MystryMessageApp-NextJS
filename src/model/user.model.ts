import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}
const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document {
    username:string;
    email:string;
    password:string;
    verificationCode:string;
    verificationCodeExpires:Date;
    isAcceptingMessage:boolean;
    isVerified:boolean;
    messages:Message[]

}
const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        match: [/^(?=.{1,254}$)(?!.*\.\.)([a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/, "Please enter a valid email"],
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    verificationCode:{
        type:String,
        required:[true,"Verification Code is Required"],
    },
    verificationCodeExpires:{
        type:Date,
        required:[true,"Verification Code Expiration Date is Required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

//this is case where we are checking if the model is already created or not
// mongoose.models.User (write models because here we are expecting the model is already created or not)
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);
export default UserModel;