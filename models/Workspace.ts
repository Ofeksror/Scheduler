import mongoose from "mongoose";

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    title: String,
    tabs: [
        {
            url: String,
            title: String,
            pinned: Boolean,
            browserTabId: Number,
            faviconUrl: String,
        }
    ],
});

const Workspace =
    mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

export default Workspace;
