import {useNavigate} from "react-router-dom";
import {getCommunities} from "./communities";

export const getUsers = () => {         //restituisce tutti gli utenti salvati nel localStorage
    return JSON.parse(localStorage.getItem("utenti"))
}

export const setUsers = (users) => {            //salva oggetto users, convertendolo in json nel localStorage
    localStorage.setItem("utenti", JSON.stringify(users))
}

export const getUser = (email) => {         //cerca un utente nella lista degli utenti nel localStorage, confrontando l’email.
    return getUsers().find(item => item.email === email)
}

export const getLoggedUser = () => {            //recupera l'utente attualmente loggato.

    if (sessionStorage.getItem("loginSession") === null)        //Controlla se esiste una sessione salvata nel sessionStorage.
        return null

    const loggedUser = getUser(JSON.parse(sessionStorage.getItem("loginSession")).user)     //parse e ottiene i dati dell'utente presente nel sessionStorage

    if (loggedUser === undefined) return null

    return loggedUser
}

export const logout = () => {           //rimuove la sessione attiva dal sessionStorage, effettuando il logout dell’utente.
    sessionStorage.removeItem("loginSession")
}

export const updateUser = (user) => {           //ottiene l'elenco degli utenti salvati nel localStorage
    const existingUsers = getUsers()
    const users = existingUsers?.filter(item => item.email !== user.email)  //rimuove l’utente con la stessa email, così da poterlo aggiornare.

    if (existingUsers) setUsers([...users, user])      //se c’erano utenti già salvati: salva la lista aggiornata
    else setUsers([user])       //Se no: crea una nuova lista con l’utente passato.

}

export const getUserCommunities = () => {
    const user = getLoggedUser()

    if (user === undefined) return null;

    const communities = getCommunities()

    const myCommunities = communities.filter(item => user.communities.includes(item.idCommunity))

    return myCommunities
}

export const getPlaylistsProprie = () => {
    const user = getLoggedUser()

    if (user === undefined) return null

    return user.playlistProprie
}

export const getPlaylistsSalvate = () => {
    const user = getLoggedUser()

    if (user === undefined) return null

    return user.playlistSalvate
}