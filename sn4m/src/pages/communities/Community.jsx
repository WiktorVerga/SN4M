import {useNavigate, useParams} from "react-router-dom";
import SearchBar from "../../Components/SearchBar";
import {useEffect, useState} from "react";
import {getCommunity, getPlaylists} from "../../utilities/communities";
import {getLoggedUser} from "../../utilities/users";
import {PlaylistCard} from "../../Components/PlaylistCard";

export const Community = () => {
    const navigate = useNavigate();

    const {id} = useParams();

    const [community, setCommunity] = useState({});

    const [communityPlaylists, setCommunityPlaylists] = useState([]);

    const loggedUser = getLoggedUser()

    useEffect(() => {
        setCommunity(getCommunity(id));
        setCommunityPlaylists(getPlaylists(getCommunity(id)));
    }, [id])

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Esplora COMMUNITIES
            </h1>

            {/* Intestazione Dinamica con Pulsante Filtro */}
            <div className={"row flex-row align-items-center"}>
                <h3 className={"col"}>
                    {community.descrizione}
                </h3>
                {community.autore === loggedUser.email &&
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

            {/* Mostra le EsploraCommunities */}
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