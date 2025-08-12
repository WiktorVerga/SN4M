import TagDisplayer from "./TagDisplayer";
import {Link} from "react-router-dom";
import {getAutorePlaylist} from "../utilities/playlists";


export const PlaylistCard = ({playlist, esplora}) => {
    console.log(playlist)

    return (
        <Link className={"card playlist-card-bg text-white m-auto shadow w-25 h-25 shadow text-decoration-none"}
            to={`/playlists/${playlist.idPlaylist}`}
        >
            <div className="card-body d-flex flex-column">
                <div className={"mb-auto"}>
                    <h3 className="card-title text-capitalize">{playlist.titolo}</h3>
                    <p className="card-text">
                        {playlist.descrizione}
                    </p>
                </div>
                <div>
                    <TagDisplayer
                        tags={playlist.tags.slice(0, 4)}
                        withDelete={false}
                        clear={true}
                    />
                    <hr />
                    <h3 className={"text-capitalize"}>{getAutorePlaylist(playlist.idPlaylist).username}</h3>
                </div>
            </div>
        </Link>
    )
}