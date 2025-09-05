import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
    checkIfSaved,
    communitiesWhereShared,
    getAutorePlaylist, getIdCondivisionePlaylisty,
    getPlaylist,
    isPublic
} from "../../utilities/playlists";
import {useEffect, useState} from "react";
import {cleanSubscribedCommunities, getLoggedUser, updateUser} from "../../utilities/users";
import SearchBar from "../../Components/SearchBar";

import share from "../../media/share.svg"
import unshare from "../../media/un-share.svg"
import salva from "../../media/salva.svg"
import salvata from "../../media/saved.svg"
import {getSongs} from "../../utilities/songs";
import {SongCard} from "../../Components/SongCard";
import {getCommunity, updateCommunity} from "../../utilities/communities";
import {toast} from "react-toastify";

export const Playlist = () => {
    const {id} = useParams()            //recupera l'id della playlist dall'URL
    const [searchParams] = useSearchParams()

    const navigate = useNavigate();

    const loggedUser = getLoggedUser()

    const autorePlaylist = getAutorePlaylist(id)                //dati autore playlist corrente

    const isProprietaria = (loggedUser.idUtente === autorePlaylist.idUtente)        //true se l'utente è il proprietario

    const [isShareOpen, setIsShareOpen] = useState(false);              //visibilità overlay "Condividi"
    const [isUnshareOpen, setIsUnshareOpen] = useState(false);          //visibilità overlay "Rimuovi condivisione"

    const [selectedItem, setSelectedItem] = useState("");               //opzione selezionata nel select

    const [canShare, setCanShare] = useState(false);            //disabilita/abilita pulsante per la condivisione o scondivisione dell'overlay

    const [isSaved, setIsSaved] = useState(false);

    const [playlist, setPlaylist] = useState({})                //dati playlist

    const [isPubblica, setIsPubblica] = useState(false);    //flag pubblica/privata

    const [canzoni, setCanzoni] = useState([]);

    const [autore, setAutore] = useState({});           //dati autore della playlist

    const [defaultData, setDefaultData] = useState([]);             //stato per reset filtri ricerca

    const [sharableCommunities, setSharableCommunities] = useState([]);         //community in cui si può condividere playlist
    const [unsharableCommunities, setUnsharableCommunities] = useState([]);     //community in cui si può togliere la condivisione playlist

    /* Generazione ID Univoco per la condivisione: basato su timestamp e numero casuale */
    function generateId() {
        return Date.now() + '-' + Math.floor(Math.random() * 10000);
    }

    const handleCondividi = () => {
        const community = getCommunity(selectedItem)        //carica la community scelta

        /* Creazione oggetto Playlist Condivisa */
        const nuovaPlaylist = {
            idPlaylist: id,
            idCondivisione: generateId(),
            commenti: []
        }

        //Aggiunto elemento all'array playlistCondivise in community
        community.playlistCondivise.push(nuovaPlaylist);

        //salvati nel localStorage i dati
        updateCommunity(community)

        //Notifica di successo
        toast.success("Playlist Condivisa!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
            progress: undefined,
        });

        //ricalcola liste condivisibili/non condivisibili dopo l'operazione
        setSharableCommunities(loggedUser.communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setUnsharableCommunities(communitiesWhereShared(id))
        setIsShareOpen(false)
    }

    const handleScondividi = () => {
        const community = getCommunity(selectedItem)        //community da cui rimuovere

        //crea e salva nuova community con playlistCondivise aggiornate
        updateCommunity({
            ...community,
            playlistCondivise: community.playlistCondivise.filter(item => item.idPlaylist !== id)       //rimuove playlist corrente dalle playlistCondivise
        })

        //Notifica di successo
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

        //ricalcola liste condivisibili/non condivisibili dopo l'operazione
        setUnsharableCommunities(communitiesWhereShared(id))
        setSharableCommunities(loggedUser.communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setIsUnshareOpen(false)
    }

    const handleSalva = () => {
        if (isSaved) {
            //se già salvata si rimuove dai salvati dell'utente questa playlist
            loggedUser.playlistSalvate = loggedUser.playlistSalvate.filter(item => item.idCondivisione !== getIdCondivisionePlaylisty(searchParams.get("idCommunity"), id))

            updateUser(loggedUser)
            setIsSaved(checkIfSaved(id))

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
                idCommunity: searchParams.get("idCommunity"),
                idCondivisione: getIdCondivisionePlaylisty(searchParams.get("idCommunity"), id),
            })

            updateUser(loggedUser)
            setIsSaved(checkIfSaved(id))

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

    const update = () => {
        setPlaylist(getPlaylist(id))
    }

    /* useEffect */

    useEffect(() => {
        setPlaylist(getPlaylist(id))        //Recupera i dati della playlist
        setIsPubblica(isPublic(id))         //Controlla se la playlist è già stata precedentemente condivisa
        setAutore(getAutorePlaylist(id))    //Recupera i dati dell'autore della playlist
        setIsSaved(checkIfSaved(id))        //Controlla se la playlist è già stata salvata o no

        //Rimuove le community a cui non si è più iscritti (perche eliminate dagli utenti proprietari)
        cleanSubscribedCommunities()

        // calcola community in cui si può condividere e dove è già condivisa
        setSharableCommunities(getLoggedUser().communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setUnsharableCommunities(communitiesWhereShared(id))
    }, [id]);       //ricalcola quando cambia l'ID playlist in URL

    //Recupera i dettagli delle canzoni della playlist
    useEffect(() => {
        if (typeof playlist.canzoni !== "undefined") {
            getSongs(playlist.canzoni).then(data => {
                setCanzoni(data)
                setDefaultData(data)
            })
        }
    }, [playlist]);


    useEffect(() => {
        //Disabilita pulsante se non è stato selezionato niente
        setCanShare(selectedItem === "");
    }, [selectedItem]);

    useEffect(() => {
        //se apro/chiudo overlay, ricalcolo flag pubblica
        setIsPubblica(isPublic(id))
    }, [isShareOpen, isUnshareOpen]);

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
            {isProprietaria?
                //Pagina Playlist Proprietaria
                <div>

                    {/* Overlay Condivisione */}
                    {isShareOpen && (
                        <div className="overlay">
                            <div className="overlay-content">
                                <h2>Scegli Dove Condividere</h2>
                                <p>Scegli in quale communities vuoi condividere la playlist</p>
                                {sharableCommunities.length > 0?
                                    <>
                                        <div className="input-group mb-3">
                                            {/* Select community in cui condividere */}
                                            <select
                                                className={"form-control"}
                                                value={selectedItem}
                                                onChange={(e) => setSelectedItem(e.target.value)}
                                            >
                                                <option value="">-- Seleziona una Community --</option>
                                                {sharableCommunities.map((idCommunity, index) => {
                                                    const community = getCommunity(idCommunity)
                                                    return <option key={index} value={community.idCommunity}>{community.titolo}</option>
                                                })}

                                            </select>
                                            {/* pulsante "Condividi" disabilitato se nulla selezionato */}
                                            <button className={"btn btn-primary"} disabled={canShare} onClick={handleCondividi}>Condividi
                                            </button>
                                        </div>
                                    </>

                                    :
                                    //caso: non ci sono nuove community dove condividere
                                    <div className={"d-flex flex-column m-3"}>
                                        <p>Nessuna Nuova Community in cui Condividere!</p>
                                        <button className={"btn btn-primary text-uppercase"} onClick={() => navigate("/esplora")}>Esplora Communities</button>
                                    </div>

                                }
                                {/* chiusura overlay */}
                                <button className={"btn btn-primary"} onClick={() => setIsShareOpen(false)}>Chiudi</button>
                            </div>
                        </div>
                    )}

                    {/* Overlay Scondivisione */}
                    {isUnshareOpen && (
                        <div className="overlay">
                            <div className="overlay-content">
                                <h2>Scegli Dove Togliere la Condivisione</h2>
                                <p>Da quale communities vuoi togliere la condivisione della playlist</p>
                                    <>
                                        <div className="input-group mb-3">
                                            {/* Select community da cui rimuovere la condivisione */}
                                            <select
                                                className={"form-control"}
                                                value={selectedItem}
                                                onChange={(e) => setSelectedItem(e.target.value)}
                                            >
                                                <option value="">-- Seleziona una Community --</option>
                                                {unsharableCommunities.map((idCommunity, index) => {
                                                    const community = getCommunity(idCommunity)
                                                    return <option key={index} value={community.idCommunity}>{community.titolo}</option>
                                                })}

                                            </select>
                                            {/* pulsante "Rimuovi" disabilitato se nulla selezionato */}
                                            <button className={"btn btn-primary"} disabled={canShare} onClick={handleScondividi}>Rimuovi
                                            </button>
                                        </div>
                                    </>
                                {/* chiusura overlay */}
                                <button className={"btn btn-primary"} onClick={() => setIsUnshareOpen(false)}>Chiudi</button>
                            </div>
                        </div>
                    )}


                    {/* Pagina Effettiva: Playlist proprietaria */}
                    <h1 className={"h1 p-5 text-center text-uppercase"}>
                        {playlist.titolo}
                    </h1>
                    {/* Intestazione Dinamica con stato pubblica/privata e Pulsante Modifica*/}
                    <div className={"row flex-row "}>
                        <h3 className={"col my-auto"}>
                            {playlist.descrizione}
                        </h3>

                        <p className={"col fs-3 text-center"}>{isPubblica? "Pubblica" : "Privata"}{isPubblica? <i className={"bi-unlock ms-2"}></i>: <i className={"bi-lock ms-2"}></i>}</p>

                        <div className={"col-2 text-center"}>
                            <button className={"btn btn-primary w-100 text-uppercase"} onClick={() => {navigate("/modificaPlaylist?idPlaylist=" + id)}}><i className="bi bi-pencil"></i></button>
                        </div>
                    </div>

                    {/* Sezione Pulsanti Share unshare e search bar */}
                    <div className={"d-flex flex-row align-items-center justify-content-evenly my-5"}>
                        <SearchBar sendSearch={sendSearch}/>
                        <div className={"mx-auto d-flex gap-3 h-50"}>
                            <button className={"mx-auto btn btn-primary text-uppercase"} onClick={() => setIsShareOpen(true)}>
                                <img src={share} alt={"Share Icon"}/>
                            </button>
                            <button className={"btn btn-primary text-uppercase mx-auto"}
                                    disabled={!isPubblica}
                                    onClick={() => setIsUnshareOpen(true)}
                            >
                                <img src={unshare} alt={"Unshare Icon"}/>
                            </button>
                        </div>
                    </div>
                    {/* Sezione Canzoni: aggiungere canzoni e mostrare card canzoni*/}
                    <Link className={"card add-song-card-bg text-decoration-none"}
                        to={`/playlists/${id}/canzoni`}
                    >
                        <div className={"card-body d-flex gap-3 align-items-center"}>
                            <div className={"btn btn-primary p-4 rounded-4 no-hover"}
                            >
                                <i>
                                    <svg width={40} height={40} viewBox="0 0 78 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M33.4286 44H5.57144C3.99287 44 2.67059 43.472 1.60459 42.416C0.538591 41.36 0.0037335 40.0547 1.92118e-05 38.5C-0.00369507 36.9453 0.531163 35.64 1.60459 34.584C2.67802 33.528 4.0003 33 5.57144 33H33.4286V5.50002C33.4286 3.94168 33.9634 2.63635 35.0331 1.58402C36.1029 0.531686 37.4251 0.00368563 39 1.89655e-05C40.5749 -0.0036477 41.899 0.524353 42.9724 1.58402C44.0459 2.64368 44.5789 3.94902 44.5714 5.50002V33H72.4286C74.0071 33 75.3313 33.528 76.401 34.584C77.4707 35.64 78.0037 36.9453 78 38.5C77.9963 40.0547 77.4614 41.3618 76.3954 42.4215C75.3294 43.4812 74.0071 44.0073 72.4286 44H44.5714V71.5C44.5714 73.0583 44.0366 74.3655 42.9669 75.4215C41.8971 76.4775 40.5749 77.0036 39 77C37.4251 76.9963 36.1029 76.4683 35.0331 75.416C33.9634 74.3636 33.4286 73.0583 33.4286 71.5V44Z" fill="white"/>
                                    </svg>
                                </i>
                            </div>
                            <p className={"text-white fs-3 my-auto"}>Aggiungi Canzoni alla Playlist</p>
                        </div>
                    </Link>

                    {playlist?.canzoni?.length > 0 ?
                        <div className={"d-flex flex-column gap-5 justify-content-center mt-5"}>
                        {canzoni.map((canzone, index) => (
                            <SongCard
                                key={index}
                                song={canzone}
                                isProprietaria={true}
                                update={update}
                            />
                        ))
                        }
                    </div>
                        :
                        <h3 className={"text-center w-100 mt-5 d-flex flex-column justify-content-center align-items-center"} style={{height: "20vh"}}>Non ci sono ancora canzoni!</h3>
                    }

                    <div className={"mt-5"}></div>
                </div>
                :

                //Pagina Playlist Generica (non proprietario)
                <div>
                    <h1 className={"h1 p-5 text-center text-uppercase"}>
                        {playlist.titolo}
                    </h1>
                    {/* intestazione: descrizione + salva/rimuovi */}
                    <div className={"d-flex flex-row justify-content-between"}>
                        <h3 className={"col-5 my-auto"}>
                            {playlist.descrizione}
                        </h3>

                        <div className={"my-auto text-center"}>
                            <button className={"btn btn-primary py-3 px-4 text-uppercase"} onClick={handleSalva}>{isSaved? <img src={salvata}/> : <img src={salva}/>}</button>
                        </div>
                    </div>
                    <div className={"my-5"}>
                        <hr/>
                        {/* autore playlist e pulsante leggi commenti */}
                        <div className={"d-flex flex-row justify-content-between"}>
                            <h2 className={"text-capitalize fs-1"}>{autore.username}</h2>
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
            }
        </div>
    )
}