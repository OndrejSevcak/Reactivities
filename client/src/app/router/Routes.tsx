import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import Counter from "../../features/counter/Counter2";
import TestErrors from "../../features/errors/TestErrors";
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
            {path: 'activities/:id', element: <ActivityDetailPage />},
            {path: 'createActivity', element: <ActivityForm key='create' />},   //the key will force the component to remount when switching paths between createActivity and edit
            {path: 'edit/:id', element: <ActivityForm />},
            {path: 'counter', element: <Counter />},
            {path: 'counter', element: <TestErrors />}
        ]
    }
]);