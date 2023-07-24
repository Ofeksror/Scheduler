import mongoose from "mongoose";

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    title: String,
    tabs: [
        {
            url: String,
            title: String,
            pinned: Boolean,
        },
    ],
});

const Workspace =
    mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

export default Workspace;
