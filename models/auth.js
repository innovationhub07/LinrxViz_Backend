import mongoose from "mongoose";
mongoose.set('strictQuery', false);

const userSchema = mongoose.Schema({
    Fname : {type: String, required: true},
    Lname : {type: String, required: true},
    email : {type: String, required: true},
    password : {type: String, required: true}
})

export default mongoose.model("users", userSchema)