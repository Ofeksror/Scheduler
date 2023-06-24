import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Sidebar from "./components/Sidebar";
import UnsavedWorkspace from "./components/UnsavedWorkspace";

function App() {
    return (
        <div>
            <Sidebar />
            <UnsavedWorkspace />
        </div>
    );
}

export default App;
