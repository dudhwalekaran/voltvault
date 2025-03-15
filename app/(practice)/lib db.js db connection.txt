import mongoose from "mongoose";

const connectionToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MongoURL)
        console.log("Connected to db")
    } catch (err) {
        console.log(err)
    }
}

export default connectionToDatabase