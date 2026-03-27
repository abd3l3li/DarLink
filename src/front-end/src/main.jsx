import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import { NotificationProvider } from "./components/utils/notificationContext.jsx";
import { DropdownProvider } from "./components/utils/dropdownContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>

        <NotificationProvider>
            <DropdownProvider>
                <App />
            </DropdownProvider>
        </NotificationProvider>

    </React.StrictMode>
);
