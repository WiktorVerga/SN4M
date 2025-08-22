import {Link} from "react-router-dom";
import {getLetter, getLoggedUser} from "../utilities/users";

export default function Navbar() {

    //Funzione per determinare se un link deve essere evidenziato come "attivo"
    const isSelected = (uri) => {
        //controlla se il percorso corrente corrisponde all'uri passato
        if (window.location.pathname === uri) return true
        else return false
    }

    return (
        <nav className={"navbar navbar-ff bg-primary p-4 shadow"}>
            <div className="container">
                {/* Nome Applicaizone che reindirizza a /esplora */}
                <Link className={"navbar-brand text-white fw-bold"} to={"/esplora"}><h2>SN4M</h2></Link>
                {/* Sezione centrale con i link di navigazione */}
                <div className={"d-flex w-75 justify-content-evenly align-items-center mx-auto"}>
                    <Link className={isSelected("/esplora")? "navbar-text text-white text-decoration-none text-center fw-bold" : "navbar-text text-white text-decoration-none text-center"} to={"/esplora"}>Esplora<br/>Communities</Link>
                    <Link className={isSelected("/tueCommunities")? "navbar-text text-white text-decoration-none text-center fw-bold" : "navbar-text text-white text-decoration-none text-center"} to={"/tueCommunities"}>Le Tue<br/>Communities</Link>
                    <Link className={isSelected("/playlists")? "navbar-text text-white text-decoration-none text-center fw-bold" : "navbar-text text-white text-decoration-none text-center"} to={"/playlists"}>Libreria<br/>Playlists</Link>
                </div>
                {/* Avatar utente (prima lettere dell'username) in alto a destra che reindirizza al profilo */}
                <Link className={"navbar-button text-decoration-none mx-auto"} to={"/profiloUtente"} onClick={() => {
                }}>
                    <div className={"avatar"}>{getLetter(getLoggedUser().idUtente)}</div>
                </Link>
            </div>
        </nav>
    )
}