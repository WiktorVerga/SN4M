import {getLoggedUser, getUser, getUsers, setUsers} from "./users";

export const getPlaylistsProprie = () => {      //restituisce le playlist create dall'utente loggato
    const user = getLoggedUser()

    if (!user) return null

    return user.playlistProprie
}
export const getPlaylists = (idPlaylist) => {      //restituisce le playlist create dall'utente loggato
    const idUtente = idPlaylist.split(".")[0]
    const utente = getUser(idUtente)

    return [...utente.playlistProprie.find(item => item.idPlaylist === idPlaylist), ...utente.playlistSalvate.find(item => item.idPlaylist === idPlaylist)]
}

export const getAutorePlaylist = (idPlaylist) => {      //restituisce l'oggetto dell'autore della playlist, dato in ingresso l'id della playlist
    const idUtente = idPlaylist.split(".")[0]
    const utente = getUser(idUtente)
    return utente
}

export const getPlaylistsSalvate = () => {      //restituisce le playlist salvate dall'utente loggato
    const user = getLoggedUser()

    if (!user) return null

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

