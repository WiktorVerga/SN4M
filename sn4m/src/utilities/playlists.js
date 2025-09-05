import {getLoggedUser, getUser, getUsers, setUsers, updateUser} from "./users";
import {getCommunity} from "./communities";

//restituisce le playlist create dall'utente loggato
export const getPlaylistsProprie = () => {
    const user = getLoggedUser()            //ottiene l'utente loggato

    if (!user) return null                  //se utente è null restituisce null

    return user.playlistProprie
}



//restituisce l'oggetto dell'autore della playlist dall'idPlaylist
export const getAutorePlaylist = (idPlaylist) => {
    const idUtente = idPlaylist.split(".")[0]           //idUtente è la parte prima del . dell'idPlaylist
    const utente = getUser(idUtente)
    return utente
}

//restituisce dati playlist dal idPlaylist
export const getPlaylist = (idPlaylist) => {
    if (!idPlaylist) return null
    //si ottiene l'utente tramite idPlaylist
    const utente = getAutorePlaylist(idPlaylist)

    return utente?.playlistProprie?.find(item => item.idPlaylist === idPlaylist)
}

//aggiornare una playlist già esistente nell'array playlistProprie dell'utente loggato
export const updatePlaylistPropria = (playlist) => {
    const existingUsers = getUsers();           //prende l'array completo di utenti.
    const loggedUser = getLoggedUser();         //prende utente loggato

    //nuovo array in cui ogni elemento resta uguale, tranne quello con id uguale che viene sostituito con la playlist aggiornata.
    const updatedPlaylists = loggedUser.playlistProprie.map(p =>
        p.idPlaylist === playlist.idPlaylist ? playlist : p
    );

    if (!updatedPlaylists.some(p => p.idPlaylist === playlist.idPlaylist)) {        //se non viene trovata nessuna playlist nelle playlistProprie viene restituito null
        return null
    }

    //sovrascrivo la proprietà playlistProprie con la versione aggiornata mantenendo immutati gli altri campi dell'utente.
    const updatedUser = { ...loggedUser, playlistProprie: updatedPlaylists };

    //Filtra utenti togliendo l'utente loggato
    const users = existingUsers?.filter(item => item.idUtente !== loggedUser.idUtente)
    setUsers([...users, updatedUser]);          //salva nel localStorage utenti con utenteAggiornato
}

//modifica array playlistProprie dell'utente loggato
export const setPlaylistsProprie = (playlists) => {
    const existingUsers = getUsers();           //prende l'array completo di utenti.
    const loggedUser = getLoggedUser();         //prende utente loggato

    //sovrascrivo la proprietà playlistProprie con l'input della funzione mantenendo immutati gli altri campi dell'utente.
    const updatedUser = { ...loggedUser, playlistProprie: playlists };

    const users = existingUsers?.filter(item => item.idUtente !== loggedUser.idUtente)        //rimuovo utente loggato dalla lista degli utenti
    setUsers([...users, updatedUser]);          //salvataggio nel localStorage
}

//controlla se la playlist è stata condivisa in qualche community
export const isPublic = (idPlaylist) => {
    const loggedUser = getLoggedUser();         //recupera l'utente attualmente loggato

    //Controlla se l'utente ha condiviso la playlist in almeno una delle communities
    return loggedUser?.communities.some(idCommunity => {        //cicla sulle community dell'utente
        if (loggedUser?.communities.length > 0) {
            //controlla se la community corrente ha nelle playlistCondivise la playlist input
            return getCommunity(idCommunity)?.playlistCondivise.some(item => item.idPlaylist === idPlaylist)
        } else return false
    })
}

//Restituisce un array con gli oggetti delle playlist salvate con tutte le informazioni
export const getFullPlaylistsSalvate = () => {

    const loggedUser = getLoggedUser();         //ottiene utente loggato

    const playlistSalvate = loggedUser?.playlistSalvate.map(playlist => {           //cicla sulle playlist salvate dall'utente e le trasforma in oggetti completi

        //Trovo la community per ogni playlist
        const community = getCommunity(playlist.idCommunity)

        //Recupero l'idPlaylist privato per ogni playlist
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

//restituisce un array con gli id delle communities in cui una playlist è stata condivisa
export const communitiesWhereShared = (idPlaylist) => {
    const whereShared = []              //array dove memorizzare le community in cui la playlist è condivisa
    const loggedUser = getLoggedUser();     //ottiene utente loggato
    const tuttiIdCommunities = loggedUser?.communities      //recupera tutti gli id delle communities dell'utente

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

//aggiunge idCanzone in una playlist
export const addSong = (idPlaylist, idCanzone) => {
    const loggedUser = getLoggedUser();         //ottiene utente loggato

    //trova nella lista delle playlist proprie dell'utente quella con l'id specificato e aggiunge l'id della canzone all'array delle canzoni
    loggedUser?.playlistProprie.find(item => item.idPlaylist === idPlaylist).canzoni.push(idCanzone)

    updateUser(loggedUser)      //aggiorna i dati nel localStorage
}

//rimuove idCanzone da una playlist
export const removeSong = (idPlaylist, idCanzone) => {
    const loggedUser = getLoggedUser();         //ottiene utente loggato

    //trova la playlist da cui rimuovere la canzone
    const playlist = loggedUser?.playlistProprie.find(item => item.idPlaylist === idPlaylist)

    //filtra l'array delle canzoni rimuovendo l'id della canzone specificata
    const canzoniAggiornate = playlist.canzoni.filter(item => item !== idCanzone)

    //aggiorna l'array delle canzoni della playlist e aggiorna la lista delle playlist proprie dell'utente sostituendo quella aggiornata
    playlist.canzoni = canzoniAggiornate
    loggedUser.playlistProprie = [...loggedUser?.playlistProprie.filter(item => item.idPlaylist !== idPlaylist), playlist]

    updateUser(loggedUser)      //aggiorna localStorage
}