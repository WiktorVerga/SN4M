import SearchBar from "../../Components/SearchBar";
import FloatingAddBtn from "../../Components/FloatingAddBtn";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import CommunityCard from "../../Components/CommunityCard";
import {getCommunities, setCommunities} from "../../utilities/communities";
import {getLoggedUser, getPlaylistsProprie, getPlaylistsSalvate, getUserCommunities} from "../../utilities/users";

export default function Playlists() {
    const navigate = useNavigate();

    const [isTue, setIsTue] = useState(false);

    const [visualizzaPlaylists, setVisualizzaPlaylists] = useState([]);


    const loggedUser = getLoggedUser()

    const update = () => {
        setCommunities(getUserCommunities())
    }

    useEffect(() => {

        /* Applico Filtro se è selezionato "Sei Iscritto" */
        if (isTue) {
            setVisualizzaPlaylists(getPlaylistsProprie()? getPlaylistsProprie() : []);
        } else {
            /*Mostra tutte le community non create né seguite dall’utente, senza filtro di corrispondenza. */
            setVisualizzaPlaylists(getPlaylistsSalvate()? getPlaylistsSalvate() : []);
        }
    }, [isTue])

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                PLAYLISTS
            </h1>

            {/* Intestazione Dinamica con Pulsante Filtro */}
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
                    {/*Nessuna community trovata*/}
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
                    {/* Mostra le EsploraCommunities */}
                    <div className={"d-flex flex-column justify-content-center mt-5"}>
                    {visualizzaPlaylists.map((communiity, index) => (
                        <CommunityCard
                            key={index}
                            community={communiity}
                            esplora={false}
                            update={update}
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