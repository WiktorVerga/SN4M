import {Link} from "react-router-dom";
import {getLoggedUser} from "../utilities/users";
import {useEffect, useState} from "react";

export default function Navbar() {

    const getLetter = () => {
        const loggedUser = getLoggedUser()
        return loggedUser?.username.charAt(0).toUpperCase()
    }

    return (
        <nav className={"navbar bg-primary p-4 shadow"}>
            <div className="container">
                <Link className={"navbar-brand text-white fw-bold fs-5"} to={"/"}>SN4M</Link>
                <Link className={"navbar-text text-white text-decoration-none"} to={"/explore"}>Esplora</Link>
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