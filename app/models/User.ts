import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: false,
        unique: false,
    },
    lastName: {
        type: String,
        required: false,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
        minlength: 5,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;