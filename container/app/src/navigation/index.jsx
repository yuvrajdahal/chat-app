import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";
import { element } from "./routes";

const PageRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {element.map((route, i) => {
          // layout elemnts
          const LayoutElement = route.element;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<LayoutElement />}
            >
              {route.children.map((child) => {
                // nested childs
                return childrenElement({ child });
              })}
            </Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
export default PageRoutes;
const childrenElement = ({ child }) => {
  const RootElement = child.element;
  // recurred childs
  const AuthCompo = () =>
    child.private ? (
      <AuthWrapper>
        <RootElement></RootElement>
      </AuthWrapper>
    ) : (
      <RootElement />
    );
  return (
    <Route
      path={child.path}
      key={child.path}
      element={
        <Suspense>
          <AuthCompo />
        </Suspense>
      }
    >
      {child?.children?.map((chilo) => childrenElement({ child: chilo }))}
    </Route>
  );
};
