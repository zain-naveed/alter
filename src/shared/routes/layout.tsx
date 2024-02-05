import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import NavWrapper from "shared/components/navWrapper";
import { routeConstant } from "./routeConstant";

interface LayoutProps {
  path: string;
  title: string;
  Component: any;
}

function Layout({ title, Component }: Partial<LayoutProps>) {
  const { user } = useSelector((state: any) => state.root);
  const location = useLocation();
  useEffect(() => {
    document.title = title + " | Alter";
  });

  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        {user?.isLoggedIn ? (
          location?.pathname.includes("short/") ? (
            <Component />
          ) : (user?.guest && location?.pathname === "/") ||
            location?.pathname === routeConstant.login.path ||
            location?.pathname === routeConstant.signup.path ||
            location?.pathname === routeConstant.terms.path ||
            location?.pathname === routeConstant.privacy.path ? (
            <Component />
          ) : (
            <NavWrapper>
              <Component />
            </NavWrapper>
          )
        ) : location?.pathname.includes("stream/") ? (
          <NavWrapper>
            <Component />
          </NavWrapper>
        ) : (
          <Component />
        )}
      </div>
    </>
  );
}

export default Layout;
