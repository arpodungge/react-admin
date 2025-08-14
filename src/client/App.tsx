import styles from "./App.css";
import { router } from "@client/route";
import { RouterProvider } from "react-router";
import AuthProvider from "./provider/authProvider";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    
  );
}

export default App;


