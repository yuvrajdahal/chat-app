import { lazy } from "react";
import PageLayout from "../components/layouts/PageLayout";

export function lazyLoad(page) {
  const LazyComp = lazy(() =>
    import(/* @vite-ignore */ `../pages/${page}/index.jsx`)
  );
  return LazyComp;
}
export const element = [
  {
    path: "/",
    element: PageLayout,
    children: [
      {
        path: "/",
        element: lazyLoad("signup"),
        name: "Signup",
      },
      {
        path: "login",
        element: lazyLoad("login"),
        name: "Login",
      },
      {
        path: "chats/*",
        element: lazyLoad("chats"),
        name: "Chats",
        private: true,
        children: [
          {
            path: "users",
            element: lazyLoad("user-chat"),
            name: "Users",
            children: [
              {
                path: ":id",
                element: lazyLoad("user-chat"),
                name: "Chat",
                children: [
                  {
                    path: ":call_id",
                    element: lazyLoad("call"),
                    name: "Call Tab",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
