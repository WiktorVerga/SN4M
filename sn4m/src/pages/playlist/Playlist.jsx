import {useParams} from "react-router-dom";
import {getAutorePlaylist, getLoggedUser, getPlaylist} from "../../utilities/users";
import {useEffect, useState} from "react";

export const Playlist = () => {
    const {id} = useParams()

    const isProprietaria = (getLoggedUser().idUtente === getAutorePlaylist(id).idUtente)

    const [playlist, setPlaylist] = useState([])

    useEffect(() => {
        setPlaylist(getPlaylist(id))
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