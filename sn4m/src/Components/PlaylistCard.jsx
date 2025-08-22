import TagDisplayer from "./TagDisplayer";
import {Link} from "react-router-dom";
import {getAutorePlaylist} from "../utilities/playlists";


export const PlaylistCard = ({playlist, idCommunity}) => {
    return (
        //la card è un Link che porta alla pagina della playlist in base al suo id
        <Link className={"card playlist-card-bg text-white m-auto shadow w-25 h-25 shadow text-decoration-none"}
            to={typeof idCommunity === 'undefined'? `/playlists/${playlist.idPlaylist}` : `/communities/${idCommunity}/playlists/${playlist.idPlaylist}`}
        >
            {/* Parte superiore della card con titolo e descrizione */}
            <div className="card-body d-flex flex-column">
                <div className={"mb-auto"}>
                    <h3 className="card-title text-capitalize">{playlist.titolo}</h3>
                    <p className="card-text">
                        {playlist.descrizione}
                    </p>
                </div>
                {/* Parte inferiore della card con tag e autore */}
                <div>
                    {/* Mostra i primi 4 tag associati alla playlist */}
                    {typeof idCommunity === "undefined" &&
                            <TagDisplayer
                            tags={playlist.tags.slice(0, 4)}
                            withDelete={false}
                            clear={true}
                        />
                    }
                    <hr />
                    <h3 className={"text-capitalize"}>{getAutorePlaylist(playlist.idPlaylist).username}</h3>
                </div>
            </div>
        </Link>
    )
}