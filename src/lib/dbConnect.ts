import mongoose, { Connection } from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGO_CONNECTION_STRING || "",
      {}
    );
    // console.log("DB : ", db);

    connection.isConnected = db.connections[0].readyState;
    // console.log("DB connection : ", db.connection);

    console.log("DB connected Successfully");
  } catch (error) {
    console.log("Failed while connecting to Database", error);

    process.exit(1);
  }
};

export default dbConnect;
