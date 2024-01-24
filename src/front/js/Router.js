import React from "react";
import ScrollToTop from "./component/scrollToTop.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";

// Import pages
import Home from "./pages/Home.js";
import Login from "./pages/access/login.js";
import Signup from "./pages/access/signup.js";
import File404 from "./pages/File404.js";

// Import components
import BackendURL from "./component/BackendURL.js";

// Layout
// import DashboardLayout from "../layout/DashboardLayout";
import NavbarLayout from "./layout/MainLayout.js"; 
import NavbarSignup from "./layout/SignupLayout";


// Create your first component
const Router = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // You can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
        
                    <Routes>
                      {/* FRONTPAGE */}
                      <Route index element={<NavbarLayout><Home /></NavbarLayout>} />

                      {/* LOGIN / SIGNUP */}
                      <Route path="/login" element={<NavbarSignup><Login /></NavbarSignup>} />
                      <Route path="/signup" element={<NavbarSignup><Signup /></NavbarSignup>} />

                      {/* NOT FOUND */}
                      <Route path="*" element={<NavbarLayout><File404 /></NavbarLayout>} />
                    </Routes>
            
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};


export default injectContext(Router);
