import {getUsers} from "./users";
import {getAutorePlaylist, getPlaylist} from "./playlists";

//recupera la voce "communities" da localStorage e trasforma la stringa in JSON
export const getCommunities = () => {
    return JSON.parse(localStorage.getItem("communities"))
}

//prende oggetto communities, lo trasforma in JSON e lo salva nel localStorage
export const setCommunities = (communities) => {
    localStorage.setItem("communities", JSON.stringify(communities))
}

//recupera informazioni di una singola community
export const getCommunity = (id) => {
    const result = getCommunities().find(item => item.idCommunity === id)
    return typeof result === 'undefined'? null : result      //se non trova nessuna community con id di input restituisce null
}

//aggiorna la lista di communities nel localStorage
export const updateCommunity = (community) => {
    const existingCommunities = getCommunities()
    const communities = existingCommunities?.filter(item => item.idCommunity !== community.idCommunity)       //filtra quelle che hanno un ID diverso da quello della community da aggiornare.

    if (existingCommunities) setCommunities([...communities, community])      //se c'erano communities salvate: aggiunge quella nuova/aggiornata all’array filtrato e lo salva nel localStorage.
    else setCommunities([community])                                           //Se no: crea un nuovo array con solo la community da aggiornare/inserire.
}

//restituisce tutte le playlist condivise all'interno di una determinata community
export const getPlaylistsDaCommunity = (community) => {
    const playlists = community.playlistCondivise                    //prende l'array delle playlist condivise dalla community

    const playlistsTrovate = []

    //cicla tutte le playlist condivise nella community
    playlists.map(playlistCondivisa => {
        const playlist = getPlaylist(playlistCondivisa.idPlaylist)
        const autore = getAutorePlaylist(playlistCondivisa.idPlaylist)

        //cerca, tra le playlist proprie dell'autore, quella con lo stesso idPlaylist
        const playlistTrovata = {
            ...autore.playlistProprie?.find(item => item.idPlaylist === playlist.idPlaylist),
            idCondivisione: playlistCondivisa.idCondivisione,
        }
        //aggiunge la playlist trovata all'array di output
        playlistsTrovate.push(playlistTrovata)
    })

    return playlistsTrovate
}

//recupera i commenti di una playlist all'interno di una community
export const getCommentiPlaylist = (idCommunity, idPlaylist) => {
    const community = getCommunity(idCommunity)     //ottiene la community tramite ID
    //trova la playlist specifica nella lista di playlist condivise
    const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)

    return playlist.commenti      //restituisce i commenti della playlist
}

//pulisce le playlist di una community rimuovendo quelle che non esistono più
export const cleanPlaylists = (idCommunty) => {
    const community = getCommunity(idCommunty)     //ottiene la community

    //verifica se la community esiste
    if (typeof community === null || community === undefined) {
        return null
    } else {
        const playlists = community.playlistCondivise    //ottiene le playlist condivise

        const playlistAggiornate = playlists.map(playlistCondivisa => {
            const autore = getAutorePlaylist(playlistCondivisa.idPlaylist)      // ottiene autore della playlist

            //verifica se la playlist esiste ancora tra le playlist proprie dell'autore
            const esisteAncora = autore.playlistProprie?.some(item => item.idPlaylist === playlistCondivisa.idPlaylist)

            return esisteAncora? playlistCondivisa : undefined      // mantiene la playlist se esiste, altrimenti restituisce undefined
        })

        // aggiorna la community con le playlist esistenti, filtrando quelle rimosse
        community.playlistCondivise = playlistAggiornate.filter(item => typeof item !== "undefined")

        updateCommunity(community)      // salva la community aggiornata nel localStorage
    }
}

//Pulisce tutte le community rimuovendo quelle il cui autore non esiste più
export const cleanCommunities = () => {
    const communities = getCommunities()    //ottiene tutte le community
    const users = getUsers()        // ottiene tutti gli utenti

    //se non ci sono community o utenti, termina
    if (!communities || !users || communities?.length === 0 || users?.length === 0) return null

    const communitiesAggiornate = communities?.map(community => {
        //verifica se l'autore della community esiste ancora tra gli utenti
        const esisteAncora = users.some(item => item.idUtente === community.autore)

        return esisteAncora? community : undefined  //mantiene la community se l'autore esiste, altrimenti undefined
    })

    // salva solo le community valide nel localStorage, filtrando quelle rimosse
    setCommunities(communitiesAggiornate?.filter(item => typeof item !== "undefined"))
}