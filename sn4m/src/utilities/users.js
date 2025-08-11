import {useNavigate} from "react-router-dom";
import {getCommunities} from "./communities";

export const getUsers = () => {         //restituisce tutti gli utenti salvati nel localStorage
    return JSON.parse(localStorage.getItem("utenti"))
}

export const setUsers = (users) => {            //salva oggetto users, convertendolo in json nel localStorage
    localStorage.setItem("utenti", JSON.stringify(users))
}

export const getUser = (idUtente) => {         //cerca un utente nella lista degli utenti nel localStorage, confrontando l’email.
    return getUsers().find(item => item.idUtente === idUtente)
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
    const users = existingUsers?.filter(item => item.idUtente !== user.idUtente)  //rimuove l’utente con la stessa email, così da poterlo aggiornare.

    if (existingUsers) setUsers([...users, user])      //se c’erano utenti già salvati: salva la lista aggiornata
    else setUsers([user])       //Se no: crea una nuova lista con l’utente passato.

}

export const getUserCommunities = () => {       //restituisce le community a cui l'utente loggato è iscritto
    const user = getLoggedUser()        //recupera l'utente loggato

    if (user === undefined) return null;           //se non esiste, interrompe

    const communities = getCommunities()        //recupera tutte le community

    const myCommunities = communities?.filter(item => user.communities.includes(item.idCommunity))   //filtra quelle in cui l'utente loggato è presente

    return myCommunities
}

export const getPlaylistsProprie = () => {      //restituisce le playlist create dall'utente loggato
    const user = getLoggedUser()

    if (user === undefined) return null

    return user.playlistProprie
}
export const getPlaylist = (idPlaylist) => {      //restituisce le playlist create dall'utente loggato
    const idUtente = idPlaylist.split(".")[0]
    const utente = getUser(idUtente)

    return utente.playlistProprie.find(item => item.idPlaylist === idPlaylist) || utente.playlistSalvate.find(item => item.idPlaylist === idPlaylist)
}

export const getAutorePlaylist = (idPlaylist) => {      //restituisce le playlist create dall'utente loggato
    const idUtente = idPlaylist.split(".")[0]
    const utente = getUser(idUtente)
    return utente
}

export const getPlaylistsSalvate = () => {      //restituisce le playlist salvate dall'utente loggato
    const user = getLoggedUser()

    if (user === undefined) return null



    return user.playlistSalvate
}

export const updatePlaylistPropria = (playlist) => {            //aggiornare una playlist già esistente nell'array playlistProprie dell'utente loggato

    const existingUsers = getUsers();           //prende l'array completo di utenti.
    const loggedUser = getLoggedUser();         //prende utente loggato

    const updatedPlaylists = loggedUser.playlistProprie.map(p =>
        p.idPlaylist === playlist.idPlaylist ? playlist : p                //nuovo array in cui ogni elemento resta uguale, tranne quello con id uguale che viene sostituito con la playlist aggiornata.
    );

    if (!updatedPlaylists.some(p => p.idPlaylist === playlist.idPlaylist)) {        //se non viene trovata nessuna playlist nelle playlistProprie viene restituito null
        return null
    }

    const updatedUser = { ...loggedUser, playlistProprie: updatedPlaylists };       //sovrascrivo la proprietà playlistProprie con la versione aggiornata mantenendo immutati gli altri campi dell'utente.

    const users = existingUsers?.filter(item => item.email !== loggedUser.email)
    setUsers([...users, updatedUser]);
}

export const setPlaylistsProprie = (playlists) => {         //modifica array playlistProprie dell'utente loggato

    const existingUsers = getUsers();           //prende l'array completo di utenti.
    const loggedUser = getLoggedUser();         //prende utente loggato

    const updatedUser = { ...loggedUser, playlistProprie: playlists };       //sovrascrivo la proprietà playlistProprie con l'input della funzione mantenendo immutati gli altri campi dell'utente.

    const users = existingUsers?.filter(item => item.email !== loggedUser.email)        //rimuovo utente loggato dalla lista degli utenti
    setUsers([...users, updatedUser]);          //salvataggio nel localStorage
}

