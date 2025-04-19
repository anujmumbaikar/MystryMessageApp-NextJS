import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
  const messageId = params.messageid
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User

  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  try {
    const updatedResult = await UserModel.updateOne(
      {_id:user._id}, //on what basis i should match
      {$pull:{messages:{_id:messageId}}}
    )
    if(updatedResult.modifiedCount === 0){
      return Response.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
