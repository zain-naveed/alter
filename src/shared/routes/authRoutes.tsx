import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  publicRoute,
  privateRoute,
  routeConstant,
  protectedRoute,
  guestRoute,
} from "./allRoutes";
import Layout from "./layout";
import { useSelector } from "react-redux";

function AuthRoute() {
  const { user, route } = useSelector((state: any) => state.root);

  return (
    <>
      <Routes>
        {!user?.isLoggedIn && route?.routeType === "public"
          ? publicRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route
                    path={"*"}
                    element={
                      <Navigate to={routeConstant.default.path} replace />
                    }
                  />
                </React.Fragment>
              );
            })
          : route?.routeType === "protected"
          ? protectedRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route
                    path={"*"}
                    element={
                      <Navigate to={routeConstant.default.path} replace />
                    }
                  />
                </React.Fragment>
              );
            })
          : user?.guest
          ? guestRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route
                    path={"*"}
                    element={
                      <Navigate to={routeConstant.default.path} replace />
                    }
                  />
                </React.Fragment>
              );
            })
          : privateRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route
                    path={"*"}
                    element={<Navigate to={routeConstant.feed.path} replace />}
                  />
                </React.Fragment>
              );
            })}
      </Routes>
    </>
  );
}

export default AuthRoute;
