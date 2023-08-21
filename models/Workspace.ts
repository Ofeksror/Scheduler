import mongoose from "mongoose";

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    title: String,
    tabsUrls: [String],
    resources: [
        {
            url: String,
            title: String,
            favIconUrl: String,
        }
    ],
});

// const Workspace =
//     mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);
const Workspace = mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

export default Workspace;
