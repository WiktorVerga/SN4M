import {cleanPlaylistSalvate, getLoggedUser, getUser, getUsers, setUsers, updateUser} from "./users";
import {getCommunity} from "./communities";

export const getPlaylistsProprie = () => {      //restituisce le playlist create dall'utente loggato
    const user = getLoggedUser()

    if (!user) return null

    return user.playlistProprie
}

export const getPlaylists = (idPlaylist) => {      //restituisce le playlist create e salvate dall'utente loggato
    if (!idPlaylist) return null
    const idUtente = idPlaylist.split(".")[0]
    const utente = getUser(idUtente)

    return [utente.playlistProprie?.find(item => item.idPlaylist === idPlaylist), utente.playlistSalvate?.find(item => item.idPlaylist === idPlaylist)]
}

export const getPlaylist = (idPlaylist) => {      //restituisce dati playlist dal idPlyalist
    return getPlaylists(idPlaylist)?.find(item => item.idPlaylist === idPlaylist)
}

export const getAutorePlaylist = (idPlaylist) => {      //restituisce l'oggetto dell'autore della playlist, dato in ingresso l'id della playlist
    const idUtente = idPlaylist.split(".")[0]           //l'id Utente è la parte prima del . dell'idPlaylist
    const utente = getUser(idUtente)
    return utente
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

    const users = existingUsers?.filter(item => item.idUtente !== loggedUser.idUtente)
    setUsers([...users, updatedUser]);
}

export const setPlaylistsProprie = (playlists) => {         //modifica array playlistProprie dell'utente loggato

    const existingUsers = getUsers();           //prende l'array completo di utenti.
    const loggedUser = getLoggedUser();         //prende utente loggato

    const updatedUser = { ...loggedUser, playlistProprie: playlists };       //sovrascrivo la proprietà playlistProprie con l'input della funzione mantenendo immutati gli altri campi dell'utente.

    const users = existingUsers?.filter(item => item.idUtente !== loggedUser.idUtente)        //rimuovo utente loggato dalla lista degli utenti
    setUsers([...users, updatedUser]);          //salvataggio nel localStorage
}

export const isPublic = (idPlaylist) => {
    const loggedUser = getLoggedUser();         //Recupera l'utente attualmente loggato

    //Controlla se l'utente ha condiviso la playlist in almeno una delle community
    return loggedUser?.communities.some(idCommunity => {        //cicla sulle community dell'utente
        if (loggedUser?.communities.length > 0) {
            //controlla se la community corrente ha nelle playlistCondivise la playlist input
            return getCommunity(idCommunity)?.playlistCondivise.some(item => item.idPlaylist === idPlaylist)
        } else return false
    })
}

//Restituisce un array con gli oggetti delle playlist salvate con tutte le informazioni
export const getFullPlaylistsSalvate = () => {

    const loggedUser = getLoggedUser();

    const playlistSalvate = loggedUser?.playlistSalvate.map(playlist => {           //cicla sulle playlist salvate dall'utente e le trasforma in oggetti completi

        //Trovo la community per ogni playlist
        const community = getCommunity(playlist.idCommunity)

        //Recupero i l'idPlaylist privato per ogni playlist
        const playlistCodivisa = community?.playlistCondivise?.find(item => item.idCondivisione = playlist.idCondivisione)

        //Restituisco l'oggetto completo della playlist aggiungendo anche l'idCommunity dove è stata condivisa per ogni playlist
        return {
            ...getPlaylist(playlistCodivisa?.idPlaylist),
            idCommunity: playlist.idCommunity
        }
    })

    //Restituisco l'array con tutti i dati completi di tutte le playlist salvate
    return playlistSalvate
}

//Restituisce l'idCondivisione di una precisa playlist dato in ingresso idCommunity e idPlaylist
export const getIdCondivisionePlaylisty = (idCommunity, idPlaylist) => {
    return getCommunity(idCommunity)?.playlistCondivise.find(item => item.idPlaylist === idPlaylist).idCondivisione
}

//Restituisce l'oggetto di una precisa playlist salvata
export const getPlaylistSalvata = (idPlaylist) => {
    return getFullPlaylistsSalvate().find(item => item.idPlaylist === idPlaylist)
}

//Controlla se la playlist di id: idPlaylist sia salvata nell'account dell'utente loggato
export const checkIfSaved = (idPlaylist) => {
    return getFullPlaylistsSalvate()?.some(item => item.idPlaylist === idPlaylist)
}

export const communitiesWhereShared = (idPlaylist) => {         //restituisce un array con gli id delle community in cui una playlist è stata condivisa
    const whereShared = []              //array dove memorizzare le community in cui la playlist è condivisa

    const loggedUser = getLoggedUser();

    const tuttiIdCommunities = loggedUser?.communities      //recupera tutti gli id delle community dell'utente

    //Crea un array di oggetti per ogni idCommunity nell'array
    const tutteCommunities = tuttiIdCommunities.map(idCommunity => {
        return getCommunity(idCommunity)
    })

    //Filtra tra le communities di cui fa parte l'utente andando a inserire in un array solo quelle in cui ha condiviso una precisa playlist
    tutteCommunities.forEach(community => {
        if (community?.playlistCondivise.some(item => item.idPlaylist === idPlaylist)) {
            whereShared.push(community.idCommunity)
        }
    })

    return whereShared
}

export const addSong = (idPlaylist, idCanzone) => {
    const loggedUser = getLoggedUser();

    loggedUser?.playlistProprie.find(item => item.idPlaylist === idPlaylist).canzoni.push(idCanzone)

    updateUser(loggedUser)
}

export const removeSong = (idPlaylist, idCanzone) => {
    const loggedUser = getLoggedUser();

    const playlist = loggedUser?.playlistProprie.find(item => item.idPlaylist === idPlaylist)

    const canzoniAggiornate = playlist.canzoni.filter(item => item !== idCanzone)

    playlist.canzoni = canzoniAggiornate

    loggedUser.playlistProprie = [...loggedUser?.playlistProprie.filter(item => item.idPlaylist !== idPlaylist), playlist]

    updateUser(loggedUser)
}