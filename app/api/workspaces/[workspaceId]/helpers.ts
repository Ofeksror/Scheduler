import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";

// Get a list of users referencing workspaceId
const getUsersReferencingWorkspace = async (workspaceId: string) => {
    const users = await User.find({ workspaces: new ObjectId(workspaceId) });
    return users;
};

// Remove reference to workspaceId from all users.
export const deleteWorkspaceReferences = async (workspaceId: string) => {
    await dbConnect();

    const users = await getUsersReferencingWorkspace(workspaceId);

    users.forEach(async (user: any) => {
        // Remove reference to workspace from user
        const indexInUserWorkspaces = user.workspaces.findIndex(
            (workspaceIterId: ObjectId) =>
                workspaceIterId.toString() == workspaceId
        );

        if (indexInUserWorkspaces !== -1) {
            user.workspaces = [
                ...user.workspaces.splice(0, indexInUserWorkspaces),
                ...user.workspaces.splice(indexInUserWorkspaces + 1),
            ];
            user.save();
        }
    });
};
