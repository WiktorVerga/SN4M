import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getPlaylistsProprie, getPlaylistsSalvate} from "../../utilities/playlists";
import {PlaylistCard} from "../../Components/PlaylistCard";
import {getLoggedUser} from "../../utilities/users";

export default function Playlists() {

    /*Variabili funzionali*/
    const navigate = useNavigate();

    const [isTue, setIsTue] = useState(false);          //Stato booleano che indica se l’utente sta visualizzando le proprie playlist (true) oppure quelle salvate (false).

    const [visualizzaPlaylists, setVisualizzaPlaylists] = useState([]);            //Stato che conterrà l’elenco delle playlist da mostrare nella pagina dopo eventuali filtri.


    useEffect(() => {

        /* Applico Filtro se è selezionato "Tue" */
        if (isTue) {
            //Mostra tutte le playlist create dall'utente loggato
            setVisualizzaPlaylists(getPlaylistsProprie()? getPlaylistsProprie() : []);
        } else {
            //Mostra tutte le playlist salvate dall'utente loggato
            setVisualizzaPlaylists(getPlaylistsSalvate()? getPlaylistsSalvate() : []);
        }
    }, [isTue])

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                PLAYLISTS
            </h1>

            {/* Intestazione Dinamica con Pulsante Filtro per Passare da "le tue" a "salvate" e viceversa. */}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {isTue? "Le Tue Playlists": "Playlists Salvate"}
                </h3>
                <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => setIsTue(!isTue)}>{isTue? "vedi salvate" : "vedi le tue"}</button>
            </div>

            {/* SearchBar */}
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar/>
            </div>

            {visualizzaPlaylists.length === 0?
                <>
                    {/*Nessuna playlist trovata*/}
                    <div className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"} style={{height: "50vh"}}>
                        <h3 className={"mb-5"}>
                            {isTue?
                                <>
                                    Non ho trovato Nulla!<br/>
                                    Inizia a Creare
                                </>
                            :
                                <>
                                    Non ho trovato Nulla!<br/>
                                    Esplora le Communities
                                </>
                            }
                        </h3>
                        {isTue?
                            <FloatingAddBtn navigateTo={"/creaPlaylist"} dim={5}/>
                            :
                            <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => navigate("/esplora")}>Esplora Communities</button>
                        }
                    </div>
                </> : <>
                    {/* Mostra le Playlist */}
                    <div className={"d-flex flex-row justify-content-center mt-5"}>
                        {visualizzaPlaylists.map((playlist, index) => (
                            <PlaylistCard
                                key={index}
                                playlist={playlist}
                            />
                        ))
                        }
                    </div>
                    <div className={"floating-btn-div"}>
                        <FloatingAddBtn navigateTo={"/creaPlaylist"}
                        dim={4}/>
                    </div>
                </>}
        </div>
    )
}