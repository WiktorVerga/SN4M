import Signin from "./pages/user/Signin";
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from "./pages/user/Login";
import ProfiloUtente from "./pages/user/ProfiloUtente";
import Navbar from "./Components/Navbar";
import CreaCommunity from "./pages/communities/CreaCommunity";
import ModificaCommunity from "./pages/communities/ModificaCommunity";
import {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import Communities from "./pages/communities/Communities";


function App() {

    const location = useLocation()
    const navigate = useNavigate()
    const excludeNavbar = ["/", "/login", "/modificaCommunity", "/creaCommunity"].includes(location.pathname);
    const [checkingAuth, setCheckingAuth] = useState(true);


    useEffect(() => {
        const checkLogin = () => {
            const token = sessionStorage.getItem("loginSession") === null

            if (token && !excludeNavbar) {
                navigate("/login")
            }

            setCheckingAuth(false);
        };

        checkLogin();
    }, [location.pathname]);

    if (checkingAuth) return null

    return (
        <>
            <div className="App">
                {!excludeNavbar &&
                    <Navbar/>
                }
                <div className={"container"}>
                    <Routes>
                        <Route path={"/signin"} element={<Signin/>}/>
                        <Route path={"/"} element={<Login/>}/>
                        <Route path={"/profiloUtente"} element={<ProfiloUtente/>}/>
                        <Route path={"/creaCommunity"} element={<CreaCommunity/>}/>
                        <Route path={"/modificaCommunity"} element={<ModificaCommunity/>}/>
                        <Route path={"/esplora"} element={<Communities/>}/>
                    </Routes>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default App;
