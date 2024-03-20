import mongoose, { ConnectOptions, connect } from "mongoose";

mongoose.set("strictQuery", false);

export const connectToDatabase = (url: string): Promise<typeof mongoose> => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;
  return connect(url, options);
};
