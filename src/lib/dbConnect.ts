import mongoose from "mongoose";
type ConnectionObject = {
    isConnected?: number;
}
const connection: ConnectionObject = {};
async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to MongoDB");
        return;
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/mystrymessage` || "")
        connection.isConnected = connectionInstance.connections[0].readyState;
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log("Database connection error:", error);
        process.exit(1);
    }
}
export default dbConnect;