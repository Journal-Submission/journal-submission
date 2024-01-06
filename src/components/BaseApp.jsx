import React, { lazy, Suspense } from "react";
// const MyComponent = React.lazy(() => import('./MyComponent'));
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../App.css";
lazy(() => import("./submission.css"));
// import Layout from "../Layout";
const Layout = lazy(() => import("../Layout"));
// import DashBoard from "./dashboard/DashBoard";
// import ViewSubmission from "./dashboard/ViewSubmission";
// import AddSubmission from "./dashboard/AddSubmission";
// import AnalyticReport from "./dashboard/AnalyticReport";
const DashBoard = lazy(() => import("./dashboard/DashBoard"));
const ViewSubmission = lazy(() => import("./dashboard/ViewSubmission"));
const AddSubmission = lazy(() => import("./dashboard/AddSubmission"));
const AnalyticReport = lazy(() => import("./dashboard/AnalyticReport"));
const Login = lazy(() => import("./login/Login"));
const SignUp = lazy(() => import("./signup/SignUp"));
const Preloader = lazy(() => import("./preloader/Preloader"));

// routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense>
            <Preloader />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Suspense>
            <DashBoard />,
          </Suspense>
        ),
        children: [
          {
            path: "view-submission",
            element: (
              <Suspense>
                <ViewSubmission />
              </Suspense>
            ),
          },
          {
            path: "add-submission",
            element: (
              <Suspense>
                <AddSubmission />
              </Suspense>
            ),
          },
          {
            path: "analytical-report",
            element: (
              <Suspense>
                <AnalyticReport />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Suspense>
        <SignUp />
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