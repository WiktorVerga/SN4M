import {getCommunity} from "../../utilities/communities";
import SearchBar from "../../Components/SearchBar";
import share from "../../media/share.svg";
import unshare from "../../media/un-share.svg";
import {Link, useNavigate, useParams} from "react-router-dom";
import {SongCard} from "../../Components/SongCard";
import salvata from "../../media/saved.svg";
import salva from "../../media/salva.svg";
import {checkIfSaved, getAutorePlaylist, getIdCondivisionePlaylisty, getPlaylist} from "../../utilities/playlists";
import {cleanSubscribedCommunities, getLoggedUser, updateUser} from "../../utilities/users";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {getSongs} from "../../utilities/songs";

export const PlaylistCommunity = () => {
    const {idPlaylist, idCommunity} = useParams()

    const navigate = useNavigate();

    const loggedUser = getLoggedUser()

    const autorePlaylist = getAutorePlaylist(idPlaylist)                //dati autore playlist corrente

    const isProprietaria = (loggedUser.idUtente === autorePlaylist.idUtente)        //true se l'utente è il proprietario

    const [isSaved, setIsSaved] = useState(false);

    const [playlist, setPlaylist] = useState({})                //dati playlist

    const [canzoni, setCanzoni] = useState([]);

    const [autore, setAutore] = useState({});           //dati autore (username, ecc.) della playlist

    const [defaultData, setDefaultData] = useState([]);             //stato per reset filtri ricerca

    const handleSalva = () => {
        if (isSaved) {
            //se già salvata si rimuove dai salvati dell'utente questa playlist
            loggedUser.playlistSalvate = loggedUser.playlistSalvate.filter(item => item.idCondivisione !== getIdCondivisionePlaylisty(idCommunity, idPlaylist))

            updateUser(loggedUser)
            setIsSaved(checkIfSaved(idPlaylist))

            //Notifica di Successo
            toast.success("Playlist Rimossa!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });
        } else {
            //Se non è ancora stata salvata la playlist, crea l'oggetto per il salvataggio e aggiorna l'utente
            loggedUser.playlistSalvate.push({
                idCommunity: idCommunity,
                idCondivisione: getIdCondivisionePlaylisty(idCommunity, idPlaylist),
            })

            console.log(loggedUser.playlistSalvate)


            updateUser(loggedUser)
            setIsSaved(checkIfSaved(idPlaylist))

            //Notifica di successo
            toast.success("Playlist Salvata!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "dark",
                progress: undefined,
            });
        }

    }

    /* useEffect Hooks */

    useEffect(() => {
        setPlaylist(getPlaylist(idPlaylist))        //Recupera i dati della playlist
        setAutore(getAutorePlaylist(idPlaylist))    //Recupera i dati dell'autore della playlist
        setIsSaved(checkIfSaved(idPlaylist))        //Controlla se la playlist è già stata salvata o no

        //Imposta dati per permettere la ricerca (imposta i dati di default e i filtri di default
        cleanSubscribedCommunities()
    }, [idPlaylist]);       //ricalcola quando cambia l'ID playlist in URL

    useEffect(() => {
        if (typeof playlist.canzoni !== "undefined") {
            getSongs(playlist.canzoni).then(data => {
                setCanzoni(data)
                setDefaultData(data)
            })
        }
    }, [playlist]);

    /* Setup per Ricerca*/

    //Imposta la lista di elementi senza filtri
    const setDefault = () => {
        setCanzoni(defaultData);
    }

    //Recupera il Termine di Ricerca dalla SearchBar
    const [search, setSearch] = useState("");
    const sendSearch = (searchTerm) => {
        setSearch(searchTerm);
    }

    //Al momento della modifica del termine di ricerca avviene la ricerca e dunque l'applicazione dei filtri
    useEffect(() => {
        if (search !== "") {
            setCanzoni(defaultData.filter(canzone => (
                canzone.titolo.toLowerCase().includes(search) || canzone.artista.toLocaleLowerCase().includes(search)
            )));
        } else {
            setDefault()
        }
    }, [search]);

    return (
        <div>
            {/*Pagina Playlist Generica (non proprietario) */}
            <div>
                <h1 className={"h1 p-5 text-center text-uppercase"}>
                    {playlist.titolo}
                </h1>
                {/* intestazione: descrizione + salva/rimuovi */}
                <div className={"d-flex flex-row justify-content-between"}>
                    <h3 className={"col-5 my-auto"}>
                        {playlist.descrizione}
                    </h3>
                    {!isProprietaria &&
                        <div className={"my-auto text-center"}>
                            <button className={"btn btn-primary py-3 px-4 text-uppercase"} onClick={handleSalva}>{isSaved ?
                                <img src={salvata}/> : <img src={salva}/>}
                            </button>
                        </div>
                    }
                </div>
                <div className={"my-5"}>
                    <hr/>
                    {/* autore playlist e pulsante leggi commenti */}
                    <div className={"d-flex flex-row justify-content-between"}>
                        <h2 className={"text-capitalize fs-1"}>{autore.username}</h2>
                        <button className={"btn btn-primary text-uppercase"} onClick={() => navigate(`/communities/${idCommunity}/playlists/${idPlaylist}/commenti`)}>Leggi Commenti
                        </button>
                    </div>
                </div>

                {/* Sezione search bar */}
                <div className={"d-flex flex-row align-items-center justify-content-evenly my-5"}>
                    <SearchBar sendSearch={sendSearch}/>
                </div>

                {/* Sezione Canzoni */}
                {playlist?.canzoni?.length > 0 ?
                    <div className={"d-flex flex-column gap-5 justify-content-center mt-5"}>
                        {canzoni.map((canzone, index) => (
                            <SongCard
                                key={index}
                                song={canzone}
                                isProprietaria={false}
                            />
                        ))
                        }
                    </div>
                    :
                    <h3 className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"}
                        style={{height: "20vh"}}>Non ci sono ancora canzoni!</h3>
                }

                <div className={"mt-5"}></div>
            </div>
        </div>
    )
}