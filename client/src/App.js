import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() { // principal component
  const mode = useSelector((state) => state.mode);//select if the theme will be either light or dark
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // cache a theme obejct 
  const isAuth = Boolean(useSelector((state) => state.token));// define if a user is logged in
  return (
    <div className="app">
      <BrowserRouter> {/* component that lets you browse arounds routers*/} 
        <ThemeProvider theme={theme}>{/* component that creates a root for the settings in theme*/}
          <CssBaseline />{/* component to kickastart a baselines for the theme*/}
          <Routes>{/*render child routes*/}
            <Route path="/" element={<LoginPage />} />{/*render '/' path to LoginPage*/}
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />{/*render '/home' path to HomePage if it's authorize, else render '/' */}
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />{/*render '/profile/:userId' path to ProfilePage with the 'userId' parameter if it's authorize, else render '/' */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;
