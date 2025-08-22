import Signin from "./pages/user/Signin";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from "./pages/user/Login";
import ProfiloUtente from "./pages/user/ProfiloUtente";
import Navbar from "./Components/Navbar";
import CreaCommunity from "./pages/communities/CreaCommunity";
import ModificaCommunity from "./pages/communities/ModificaCommunity";
import {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import EsploraCommunities from "./pages/communities/EsploraCommunities";
import CreaPlaylist from "./pages/playlist/CreaPlaylist";
import ModificaPlaylist from "./pages/playlist/ModificaPlaylist";
import TueCommunities from "./pages/communities/TueCommunities";
import Playlists from "./pages/playlist/Playlists";
import {Playlist} from "./pages/playlist/Playlist";
import {Community} from "./pages/communities/Community";
import {Footer} from "./Components/Footer";
import AddSongs from "./pages/playlist/AddSong";
import {cleanCommunities} from "./utilities/communities";
import {cleanPlaylistSalvate, cleanSubscribedCommunities} from "./utilities/users";
import {Commenti} from "./pages/playlist/Commenti";
import {PlaylistCommunity} from "./pages/playlist/playlistCommunity";


function App() {
    const location = useLocation()          //recupera il percorso attuale (URL)
    const navigate = useNavigate()      //permette la navigazione programmata
    const excludeNavbar = ["/", "/signin"].includes(location.pathname);         //nasconde Navbar per pagine di login e registrazione
    const [checkingAuth, setCheckingAuth] = useState(true);             //serve a bloccare il rendering della pagina finché non è stato verificato se l’utente è autenticato.

    /* UseEffect principale: pulizia dati e controllo login */
    useEffect(() => {
        //pulisce eventuali dati obsoleti in localStorage
        cleanCommunities()
        cleanSubscribedCommunities()
        cleanPlaylistSalvate()

        //verifica presenza sessione
        const checkLogin = () => {
            const token = sessionStorage.getItem("loginSession") === null

            if (token && !excludeNavbar) {
                navigate("/")          //reindirizza l'utente al login se non è loggato
            }

            setCheckingAuth(false);    //se l'utente è loggato il sito può continuare a renderizzare il resto delle pagine
        };

        checkLogin();
    }, [location.pathname]); //funzione eseguita ogni volta che cambia il percorso della pagina.


    if (checkingAuth) return null       //finché checkingAuth è true, non viene renderizzato nulla. Questo evita che l'interfaccia compaia brevemente anche se l'utente non è autenticato.


    return (                        //rendering app
        <>
            <div className="App">
                {/* Navbar*/}
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
                        <Route path={"/esplora"} element={<EsploraCommunities/>}/>
                        <Route path={"/communities/:id"} element={<Community/>}/>
                        <Route path={"/tueCommunities"} element={<TueCommunities/>}/>
                        <Route path={"/playlists"} element={<Playlists/>}/>
                        <Route path={"/playlists/:id"} element={<Playlist/>}/>
                        <Route path={"/communities/:idCommunity/playlists/:idPlaylist"} element={<PlaylistCommunity/>}/>
                        <Route path={"/communities/:idCommunity/playlists/:idPlaylist/commenti"} element={<Commenti/>}/>
                        <Route path={"/playlists/:id/canzoni"} element={<AddSongs/>}/>
                        <Route path={"/creaPlaylist"} element={<CreaPlaylist/>}/>
                        <Route path={"/modificaPlaylist"} element={<ModificaPlaylist/>}/>
                    </Routes>
                </div>
                {/* Footer sempre presente */}
                <Footer/>
                {/* Container per notifiche toast */}
                <ToastContainer/>
            </div>
        </>
    );
}

export default App;
