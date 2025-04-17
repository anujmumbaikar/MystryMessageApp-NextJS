import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        }, {
            status:401
        })
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match:{id:userId} },
            {$unwind:"$messages"},  //unwind mostly used for array.
            //it something like opens up the array
            {$sort:{'messages.createdAt':-1}}, //sort the messages by createdAt in descending order
            {$group:{
                _id:"$_id",
                messages:{$push:"messages"}, //$push is used to push the messages into an array
                 
            }}
        ])
        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"User not found"
            }, {
                status:404
            })
        }
        return Response.json(
            {
                success:true,
                messages:user[0].messages
            },
            {status:200}
        )
    } catch (error) {

        
    }

}