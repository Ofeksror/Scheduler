import { workspaceType } from "./WorkspaceContext";

export const unsavedWorkspaces: workspaceType[] = [
    {
        id: 1,
        tabs: ["asdasd", "12121", "vbbvcbvc", "223213"],
    },
    {
        id: 2,
        tabs: ["2Asdsadsa", "2bdd", "2cccs", "2dddd"],
    },
    {
        id: 3,
        tabs: ["3aaa", "3bb", "3ccc", "4dd"],
    },
];

export const savedWorkspaces: workspaceType[] = [
    {
        id: 4,
        title: "Job Hunting",
        tabs: ["LinkedIn", "TechMonster", "AllJobs"],
    },
    {
        id: 5,
        title: "Learning Software",
        tabs: ["StackOverflow", "TailwindCSS", "Vercel", "React Docs"],
    },
    {
        id: 6,
        title: "Learning Finance",
        tabs: ["Graham Stephan", "Rich Dad Poor Dad", "Calcalist"],
    },
    {
        id: 7,
        title: "Style Glow Up",
        tabs: [
            "Top 10 Perfumes",
            "Old Money Fashion Stores",
            "ZARA",
            "Pull & Bear",
        ],
    },
];
