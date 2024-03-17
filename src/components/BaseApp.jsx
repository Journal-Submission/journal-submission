import React, { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// React.lazy() is used to dynamically import a component when it's rendered.
lazy(() => import("../App.css"));
lazy(() => import('./submission.css'));
const Loading = lazy(() => import("../utils/Loading"));
const Layout = lazy(() => import("../Layout"));
const DashBoard = lazy(() => import("./dashboard/DashBoard"));
const ViewSubmission = lazy(() => import("./dashboard/ViewSubmission"));
const AddSubmission = lazy(() => import("./dashboard/AddSubmission"));
const AnalyticReport = lazy(() => import("./dashboard/AnalyticReport"));
const Login = lazy(() => import("./login/Login"));
const SignUp = lazy(() => import("./signup/SignUp"));
const Preloader = lazy(() => import("./preloader/Preloader"));
const Logout = lazy(() => import("./logout/Logout"));
const Profile = lazy(() => import("./profile/Profile"));
const Verification = lazy(() => import("./signup/Verification"));
const ForgotPassword = lazy(() => import("./login/ForgotPassword"));
const Editor = lazy(() => import("./editor/Editor"));
const ProtectedRoute = lazy(() => import("../utils/ProtectedRoute"));
const Reviewer = lazy(() => import("./reviewer/Reviewer"));
const AddReviewer = lazy(() => import("./reviewer/AddReviewer"));
const ViewArticles = lazy(() => import("./dashboard/ViewArticles"));
// import DOCViewer from "./fileviewer/DOCViewer";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                path: '/',
                element: <Preloader />
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <DashBoard />
                            </Suspense>
                        ),
                        children: [
                            {
                                path: "profile",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <Profile />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "editor",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <Editor />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "add-submission/:journalId?",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AddSubmission />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "analytical-report",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AnalyticReport />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "review-article",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <Reviewer />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "view-articles",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ViewArticles />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "add-reviewer",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AddReviewer />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "view-submission/:journalId?",
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ViewSubmission />
                                    </Suspense>
                                ),
                            },
                        ],
                    }
                ],
            },
        ],
    },
    {
        path: "/login",
        element: (
            <Suspense fallback={<Loading />}>
                <Login />
            </Suspense>
        ),
        children: [
            {
                path: "forgot-password",
                element: (
                    <Suspense fallback={<Loading />}>
                        <ForgotPassword />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "/sign-up",
        element: (
            <Suspense fallback={<Loading />}>
                <SignUp />
            </Suspense>
        ),
        children: [
            {
                path: "verify-email",
                element: (
                    <Suspense fallback={<Loading />}>
                        <Verification />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "/logout",
        element: (
            <Suspense fallback={<Loading />}>
                <Logout />
            </Suspense>
        ),
    },
    {
        path: "/*",
        element: (
            <Suspense fallback={<Loading />}>
                <h1>404 Not Found</h1>
            </Suspense>
        ),
    },
]);

function BaseApp() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default BaseApp;