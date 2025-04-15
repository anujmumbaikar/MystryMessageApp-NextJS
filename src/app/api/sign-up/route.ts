import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists",
            },
            {
                status:400,
            })
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists",
                },
                {
                    status:400,
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verificationCode = verificationCode;
                existingUserByEmail.verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                    username,
                    email,
                    password:hashedPassword,
                    verificationCode,
                    verificationCodeExpires:expiryDate,
                    isAcceptingMessage:true,
                    isVerified:false,
                    message:[]
            })
            await newUser.save();
        }
        //now send the verification email
        const emailResponse = await sendVerificationEmail(email, verificationCode,username);
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,  // "Error sending verification email" this is also fine
            },
            {
                status:500,
            })
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully",
        },
        {
            status:200,
        })
    } catch (error) {
        console.log("Error Registering User: ", error);
        return Response.json({
            success: false,
            message: "Error Registering User",
        },
        {
            status:500,
        })
    }
}