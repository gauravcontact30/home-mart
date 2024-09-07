import mongoose from "mongoose";

let connection: typeof mongoose;

const url = "mongodb://127.0.0.1:27017/next_ecom";

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (err) {
    throw new Error((err as any).message);
  }
};

export default startDb;
