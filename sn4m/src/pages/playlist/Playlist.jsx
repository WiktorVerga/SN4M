import {Link, useNavigate, useParams} from "react-router-dom";
import {
    communitiesWhereShared,
    getAutorePlaylist,
    getPlaylist,
    getPlaylists,
    isPublic
} from "../../utilities/playlists";
import {useEffect, useState} from "react";
import {getLoggedUser} from "../../utilities/users";
import SearchBar from "../../Components/SearchBar";

import share from "../../media/share.svg"
import unshare from "../../media/un-share.svg"
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {getSong} from "../../utilities/songs";
import {SongCard} from "../../Components/SongCard";
import {PlaylistCard} from "../../Components/PlaylistCard";
import {getCommunity, updateCommunity} from "../../utilities/communities";
import {toast} from "react-toastify";

export const Playlist = () => {
    const {id} = useParams()            //recupera l'id della playlist dall'URL

    const navigate = useNavigate();

    const loggedUser = getLoggedUser()

    const autorePlaylist = getAutorePlaylist(id)

    const isProprietaria = (loggedUser.idUtente === autorePlaylist.idUtente)

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isUnshareOpen, setIsUnshareOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState("");

    const [canShare, setCanShare] = useState(false);

    const [playlist, setPlaylist] = useState({})
    const [isPubblica, setIsPubblica] = useState(false);

    const [canzoni, setCanzoni] = useState([]);

    const [sharableCommunities, setSharableCommunities] = useState([]);
    const [unsharableCommunities, setUnsharableCommunities] = useState([]);

    const handleCondividi = () => {
        const community = getCommunity(selectedItem)

        /* Generazione ID Univoco: basato su timestamp e numero casuale */
        function generateId() {
            return Date.now() + '-' + Math.floor(Math.random() * 10000);
        }


        const nuovaPlaylist = {
            idPlaylist: id,
            idCondivisione: generateId(),
            commenti: []
        }

        community.playlistCondivise.push(nuovaPlaylist);

        updateCommunity(community)

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

        setSharableCommunities(loggedUser.communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setUnsharableCommunities(communitiesWhereShared(id))
        setIsShareOpen(false)
    }

    const handleScondividi = () => {
        const community = getCommunity(selectedItem)

        updateCommunity({
            ...community,
            playlistCondivise: community.playlistCondivise.filter(item => item.idPlaylist !== id)
        })

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

        setUnsharableCommunities(communitiesWhereShared(id))
        setSharableCommunities(loggedUser.communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setIsUnshareOpen(false)
    }

    useEffect(() => {
        setPlaylist(getPlaylist(id))
        setIsPubblica(isPublic(id))

        setSharableCommunities(loggedUser.communities.filter(item => !communitiesWhereShared(id).includes(item)))
        setUnsharableCommunities(communitiesWhereShared(id))
    }, [id]);

    useEffect(() => {
        getSong("2nLtzopw4rPReszdYBJU6h").then(data => {
            setCanzoni([data])
        })

    }, [playlist]);

    useEffect(() => {
        setCanShare(selectedItem === "");
    }, [selectedItem]);

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
                                            <button className={"btn btn-primary"} disabled={canShare} onClick={handleCondividi}>Condividi
                                            </button>
                                        </div>
                                    </>

                                    :
                                    <div className={"d-flex flex-column m-3"}>
                                        <p>Nessuna Nuova Community in cui Condividere!</p>
                                        <button className={"btn btn-primary text-uppercase"} onClick={() => navigate("/esplora")}>Esplora Communities</button>
                                    </div>

                                }

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

                                            <select
                                                className={"form-control"}
                                                value={selectedItem}
                                                onChange={(e) => setSelectedItem(e.target.value)}
                                            >
                                                <option value="">-- Seleziona una Community --</option>
                                                {unsharableCommunities.map(idCommunity => {
                                                    const community = getCommunity(idCommunity)
                                                    return <option value={community.idCommunity}>{community.titolo}</option>
                                                })}

                                            </select>
                                            <button className={"btn btn-primary"} disabled={canShare} onClick={handleScondividi}>Rimuovi
                                            </button>
                                        </div>
                                    </>

                                <button className={"btn btn-primary"} onClick={() => setIsUnshareOpen(false)}>Chiudi</button>
                            </div>
                        </div>
                    )}




                    <h1 className={"h1 p-5 text-center text-uppercase"}>
                        {playlist.titolo}
                    </h1>
                    {/* Intestazione Dinamica con Pulsante Modifica solo per il proprietario della Playlist*/}
                    <div className={"row flex-row "}>
                        <h3 className={"col my-auto"}>
                            {playlist.descrizione}
                        </h3>

                        <p className={"col fs-3 text-center"}>{isPubblica? "Pubblica" : "Privata"}</p>

                        <div className={"col-2 text-center"}>
                            <button className={"btn btn-primary w-100 text-uppercase"} onClick={() => {navigate("/modificaPlaylist?idPlaylist=" + id)}}><i className="bi bi-pencil"></i></button>
                        </div>
                    </div>

                    {/* Sezione Pulsanti Share unshare e search bar */}
                    <div className={"d-flex flex-row align-items-center justify-content-evenly my-5"}>
                        <SearchBar />
                        <div className={"mx-auto d-flex gap-3 h-50"}>
                            <button className={"mx-auto btn btn-primary text-uppercase"} onClick={() => setIsShareOpen(true)}>
                                <img src={share} alt={"Share Icon"}/>
                            </button>
                            <button className={"btn btn-primary text-uppercase mx-auto"}
                                    disabled={isPubblica}
                                    onClick={() => setIsUnshareOpen(true)}
                            >
                                <img src={unshare} alt={"Unshare Icon"}/>
                            </button>
                        </div>
                    </div>

                    <Link className={"card add-song-card-bg text-decoration-none"}
                        to={`/playlist/${id}`}
                    >
                        <div className={"card-body d-flex gap-3 align-items-center"}>
                            <FloatingAddBtn dim={4} navigateTo={""}/>
                            <p className={"text-white fs-3 my-auto"}>Aggiungi Canzoni alla Playlist</p>
                        </div>
                    </Link>

                    <div className={"d-flex flex-row justify-content-center mt-5"}>
                        {canzoni.map((canzone, index) => (
                            <SongCard
                                key={index}
                                song={canzone}
                                isProprietaria={true}
                            />
                        ))
                        }
                    </div>

                    <div className={"mt-5"}></div>
                </div>
                :

                //Pagina Playlist Generica
                <div>
                    <h1 className={"h1 p-5 text-center text-uppercase"}>
                        titolo
                    </h1>


                </div>
            }
        </div>
    )
}