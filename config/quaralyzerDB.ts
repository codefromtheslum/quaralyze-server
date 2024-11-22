import mongoose from "mongoose"
import env from "dotenv";
env.config();

const baseUrl: string = process.env.MONGO_STRING!
export const quaralyzerDB = () => {
    mongoose.connect(`${baseUrl}`).then(() => {
        console.log(`Database connection established ❤️❤️❤️...`)
    })
}