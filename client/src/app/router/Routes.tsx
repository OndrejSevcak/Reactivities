import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetail from "../../features/activities/details/ActivityDetail";
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
            {path: 'activities/:id', element: <ActivityDetail />},
            {path: 'createActivity', element: <ActivityForm key='create' />},   //the key will force the component to remount when switching paths between createActivity and edit
            {path: 'edit/:id', element: <ActivityForm />}
        ]
    }
]);