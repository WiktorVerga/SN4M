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
import CreaPlaylist from "./pages/playlist/CreaPlaylist";
import ModificaPlaylist from "./pages/playlist/ModificaPlaylist";


function App() {

    const location = useLocation()
    const navigate = useNavigate()
    const excludeNavbar = ["/", "/signin", "/modificaCommunity", "/creaCommunity"].includes(location.pathname);
    const [checkingAuth, setCheckingAuth] = useState(true);             //serve a bloccare il rendering della pagina finché non è stato verificato se l’utente è autenticato.


    useEffect(() => {
        const checkLogin = () => {
            const token = sessionStorage.getItem("loginSession") === null

            if (token && !excludeNavbar) {
                navigate("/")          //reindirizza l'utente al login se non è loggato
            }

            setCheckingAuth(false);    //se l'utente è loggato il sito può continuare a renderizzare il resto delle pagine
        };

        checkLogin();
    }, [location.pathname]); //funzione eseguita ogni volta che cambia il percorso della pagina (location.pathname).


    if (checkingAuth) return null       //finché checkingAuth è true, non viene renderizzato nulla. Questo evita che l'interfaccia compaia brevemente anche se l'utente non è autenticato.


    return (                        //rendering app
        <>
            <div className="App">
                {!excludeNavbar &&
                    <Navbar/>
                }
                <div className={"container"}>
                    {/* pagine presenti nell'app */}
                    <Routes>
                        <Route path={"/signin"} element={<Signin/>}/>
                        <Route path={"/"} element={<Login/>}/>
                        <Route path={"/profiloUtente"} element={<ProfiloUtente/>}/>
                        <Route path={"/creaCommunity"} element={<CreaCommunity/>}/>
                        <Route path={"/modificaCommunity"} element={<ModificaCommunity/>}/>
                        <Route path={"/esplora"} element={<Communities/>}/>
                        <Route path={"/creaPlaylist"} element={<CreaPlaylist/>}/>
                        <Route path={"/modificaPlaylist"} element={<ModificaPlaylist/>}/>
                    </Routes>
                </div>
                <ToastContainer/>
            </div>
        </>
    );
}

export default App;
