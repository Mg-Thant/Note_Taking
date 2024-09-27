import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  Create,
  Edit,
  Main,
  Home,
  Details,
  SignIn,
  SignUp,
} from "./pages/index";
import isLoginLoader from "./utils/isLogin";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/create",
          loader: isLoginLoader,
          element: <Create />,
        },
        {
          path: "/edit/:id",
          loader: isLoginLoader,
          element: <Edit />,
        },
        {
          path: "/notes/:id",
          element: <Details />,
        },
        {
          path: "/register",
          element: <SignUp />,
        },
        {
          path: "/login",
          element: <SignIn />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
