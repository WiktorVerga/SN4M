import {useParams} from "react-router-dom";
import {getAutorePlaylist, getPlaylists} from "../../utilities/playlists";
import {useEffect, useState} from "react";
import {getLoggedUser} from "../../utilities/users";

export const Playlist = () => {
    const {id} = useParams()

    const isProprietaria = (getLoggedUser().idUtente === getAutorePlaylist(id).idUtente)

    const [playlist, setPlaylist] = useState([])

    useEffect(() => {
        setPlaylist(getPlaylists(id))
    }, [id]);

    return (
        <div>
            {isProprietaria?
                //Pagina Playlist Proprietaria
                <div>

                </div>
                :

                //Pagina Playlist Generica
                <div>
                    <h1 className={"h1 p-5 text-center text-uppercase"}>

                    </h1>

                </div>
            }
        </div>
    )
}