import mongoose from "mongoose";

type ConnectionObj = {
    isConnected? : number //? means optional
}


const connection : ConnectionObj = {};

async function dbConnect(): Promise<void> { //void i dont care what it returns
    if(connection.isConnected) {
        console.log("Already connected");
        return;
    }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL || "", {});

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected");
    // console.log(db);
    // console.log(db.connections);
    // console.log(connection.isConnected);
    
    

    
  } catch (error) {
    console.log(" Database connection failed",error);

    process.exit(1);
  }
}


export default dbConnect;