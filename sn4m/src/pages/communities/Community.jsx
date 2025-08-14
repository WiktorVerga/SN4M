import {Link, useNavigate, useParams} from "react-router-dom";
import SearchBar from "../../Components/SearchBar";
import {useEffect, useState} from "react";
import {getCommunity, getPlaylists} from "../../utilities/communities";
import {getLoggedUser} from "../../utilities/users";
import {PlaylistCard} from "../../Components/PlaylistCard";
import {getAutorePlaylist} from "../../utilities/playlists";
import share from "../../media/share.svg";

export const Community = () => {
    /* Variabili Funzionali */
    const navigate = useNavigate();

    const {id} = useParams();       //recupera l'ID della community dalla URL

    const [community, setCommunity] = useState({});      //stato per salvare i dati della community corrente

    const [communityPlaylists, setCommunityPlaylists] = useState([]);       //stato per le playlist della community

    const [defaultData, setDefaultData] = useState([]);

    const loggedUser = getLoggedUser()

    /* useEffect hooks */

    useEffect(() => {
        //recupera i dati della community usando l'ID preso dai parametri della URL
        setCommunity(getCommunity(id));
        //recupera le playlist associate a questa community
        setDefaultData(getPlaylists(getCommunity(id)))
    }, [id])           //si aggiorna ogni volta che cambia l'ID nella URL

    useEffect(() => {
        setCommunityPlaylists(defaultData)
    }, [defaultData]);
    /* Setup per Ricerca*/
    const setDefault = () => {
        setCommunityPlaylists(defaultData);
    }

    const [search, setSearch] = useState("");

    const sendSearch = (searchTerm) => {
        setSearch(searchTerm);
    }

    useEffect(() => {
        if (search !== "") {
            setCommunityPlaylists(defaultData.filter(playlist => (
                playlist.titolo.toLowerCase().includes(search) || playlist.tags.some(tag => tag.toLowerCase().includes(search)) || getAutorePlaylist(playlist.idPlaylist).username.toLocaleLowerCase().includes(search)
            )));
        } else {
            setDefault()
        }
    }, [search]);

    return (
        <div>
            <h1 className={"h1 p-5 text-center text-capitalize fw-semibold"}>
                {community.titolo}
            </h1>

            {/* Intestazione Dinamica con Pulsante Modifica solo per il proprietario della community*/}
            <div className={"row flex-row align-items-center "}>
                <h3 className={"col fs-5"}>
                    {community.descrizione}
                </h3>
                {community.autore === loggedUser.idUtente &&
                    <button className={"col-2 btn btn-primary text-uppercase"} onClick={() => {navigate("/modificaCommunity?idCommunity=" + id)}}><i className="bi bi-pencil"></i></button>
                }

            </div>

            <hr className={"my-5"}/>

            <h2 className={"h1 text-center text-uppercase"}>
                Esplora PLAYLISTS
            </h2>


            {/* SearchBar */}
            <div className={"d-flex justify-content-center mt-5"}>
                <SearchBar sendSearch={sendSearch} />
            </div>

            {communityPlaylists.length > 0?
                /* Mostra le Playlist presenti all'interno della community */
                <div className={"d-flex flex-row justify-content-center mt-5"}>
                    {communityPlaylists.map((playlist, index) => (
                        <PlaylistCard
                            key={index}
                            playlist={playlist}
                        />
                    ))
                    }
                </div>
                :
                <div className={"d-flex flex-column justify-content-center mt-5 text-center"}>
                    <h2 className={"fs-2"}>Troppo silenzio qui...</h2>
                    <p className={"fs-5"}>Non è stata ancora condivisa nessuna playlist
                        <br/>
                        {community.autore === loggedUser.idUtente && "Inizia tu a condividere!"}
                    </p>
                    {community.autore === loggedUser.idUtente &&
                        <Link className={"btn btn-primary p-3 mx-auto"} to={"/playlists"}><img src={share}
                                                                                               alt={"Share Icon"}/></Link>
                    }
                </div>
            }


        </div>


    )
}