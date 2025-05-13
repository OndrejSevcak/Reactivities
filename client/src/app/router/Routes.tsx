import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: '', element: <HomePage />},
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'createActivity', element: <ActivityForm />}
        ]
    }
]);