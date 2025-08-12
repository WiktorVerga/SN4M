import {useNavigate, useParams} from "react-router-dom";
import SearchBar from "../../Components/SearchBar";
import {useEffect, useState} from "react";
import {getCommunity, getPlaylists} from "../../utilities/communities";
import {getLoggedUser} from "../../utilities/users";
import {PlaylistCard} from "../../Components/PlaylistCard";

export const Community = () => {
    /* Variabili Funzionali */
    const navigate = useNavigate();

    const {id} = useParams();       //recupera l'ID della community dalla URL

    const [community, setCommunity] = useState({});      //stato per salvare i dati della community corrente

    const [communityPlaylists, setCommunityPlaylists] = useState([]);       //stato per le playlist della community

    const loggedUser = getLoggedUser()

    /* useEffect hooks */

    useEffect(() => {
        //recupera i dati della community usando l'ID preso dai parametri della URL
        setCommunity(getCommunity(id));
        //recupera le playlist associate a questa community
        setCommunityPlaylists(getPlaylists(getCommunity(id)));
    }, [id])            //si aggiorna ogni volta che cambia l'ID nella URL


    return (
        <div>
            <h1 className={"h1 p-5 text-center text-capitalize fw-semibold"}>
                {community.titolo}
            </h1>

            {/* Intestazione Dinamica con Pulsante Modifica solo per il proprietario della community*/}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {community.descrizione}
                </h3>
                {community.autore === loggedUser.idUtente &&
                    <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => {navigate("/modificaCommunity?idCommunity=" + id)}}><i className="bi bi-pencil"></i></button>
                }

            </div>

            <h2 className={"h1 p-5 text-center text-uppercase"}>
                Esplora PLAYLISTS
            </h2>


            {/* SearchBar */}
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar/>
            </div>

            {/* Mostra le Playlist presenti all'interno della community */}
            <div className={"d-flex flex-row justify-content-center mt-5"}>
                {communityPlaylists.map((playlist, index) => (
                    <PlaylistCard
                        key={index}
                        playlist={playlist}
                    />
                ))
                }
            </div>
        </div>


    )
}