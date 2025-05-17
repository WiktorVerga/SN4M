import {Link, useNavigate} from "react-router-dom";
import {getLoggedUser} from "../utilities/users";
import {useEffect, useState} from "react";

export default function Navbar() {

    const navigate = useNavigate();

    const getLetter = () => {
        const loggedUser = getLoggedUser()
        if (loggedUser === null) return


        return loggedUser?.username.charAt(0).toUpperCase()
    }

    return (
        <nav className={"navbar navbar-ff bg-primary p-4 shadow"}>
            <div className="container">
                <Link className={"navbar-brand text-white fw-bold"} to={"/"}><h2>SN4M</h2></Link>
                <Link className={"navbar-text text-white text-decoration-none"} to={"/esplora"}>Esplora</Link>
                <Link className={"navbar-text text-white text-decoration-none"} to={"/communities"}>Communities</Link>
                <Link className={"navbar-text text-white text-decoration-none"} to={"/playlists"}>Playlists</Link>
                <Link className={"navbar-button text-decoration-none"} to={"/profiloUtente"} onClick={() => {
                }}>
                    <div className={"avatar"}>{getLetter()}</div>
                </Link>
            </div>
        </nav>
    )
}