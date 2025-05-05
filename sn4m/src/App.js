import {useState} from "react";
import Signin from "./pages/Signin";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Login from "./pages/Login";
import ProfiloUtente from "./pages/ProfiloUtente";
import Navbar from "./Components/Navbar";


function App() {

    const location = useLocation()
    const excludeNavbar = ["/", "/login"].includes(location.pathname);
    
    return (
        <>
            <div className="App">
                {!excludeNavbar &&
                    <Navbar/>
                }
                <div className={"container"}>
                    <Routes>
                        <Route path={"/"} element={<Signin/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/profiloUtente"} element={<ProfiloUtente/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
