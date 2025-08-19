import {getLoggedUser, getUser, getUsers} from "./users";
import {getAutorePlaylist, getPlaylist} from "./playlists";

export const getCommunities = () => {       //recupera la voce "communities" da localStorage e trasforma il JSON in stringa
    return JSON.parse(localStorage.getItem("communities"))
}

export const setCommunities = (communities) => {    //prende oggetto communities, lo trasforma in JSON e lo salva nel localStorage
    localStorage.setItem("communities", JSON.stringify(communities))
}

export const getCommunity = (id) => {           //recupera informazioni di una singola community
    const result = getCommunities().find(item => item.idCommunity === id)
    return typeof result === 'undefined'? null : result      //se non trova nessuna community con id di input restituisce null
}

export const updateCommunity = (community) => {   //ottiene la lista esistente di community dal localStorage.
    const existingCommunities = getCommunities()
    const communities = existingCommunities?.filter(item => item.idCommunity !== community.idCommunity)       //filtra quelle che hanno un ID diverso da quello della community da aggiornare.

    if (existingCommunities) setCommunities([...communities, community])      //se c'erano community salvate: aggiunge quella nuova/aggiornata all’array filtrato e lo salva nel localStorage.
    else setCommunities([community])                                           //Se no: crea un nuovo array con solo la community da aggiornare/inserire.
}

export const getPlaylistsDaCommunity = (community) => {            //restituisce tutte le playlist condivise all'interno di una determinata community
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

export const getCommentiPlaylist = (idCommunity, idPlaylist) => {
    const community = getCommunity(idCommunity)
    const playlist = community.playlistCondivise.find(item => item.idPlaylist === idPlaylist)

    return playlist.commenti
}

export const cleanPlaylists = (idCommunty) => {
    const community = getCommunity(idCommunty)

    if (typeof community === null || community === undefined) {
        return null
    } else {
        const playlists = community.playlistCondivise

        const playlistAggiornate = playlists.map(playlistCondivisa => {
            const autore = getAutorePlaylist(playlistCondivisa.idPlaylist)

            //cerca, tra le playlist proprie dell'autore, quella con lo stesso idPlaylist

            const esisteAncora = autore.playlistProprie?.some(item => item.idPlaylist === playlistCondivisa.idPlaylist)

            return esisteAncora? playlistCondivisa : undefined
        })

        community.playlistCondivise = playlistAggiornate.filter(item => typeof item !== "undefined")

        updateCommunity(community)
    }
}

export const cleanCommunities = () => {
    const communities = getCommunities()
    const users = getUsers()

    if (communities.length === 0 || users.length === 0) return null

    const communitiesAggiornate = communities.map(community => {
        const esisteAncora = users.some(item => item.idUtente === community.autore)

        return esisteAncora? community : undefined
    })

    setCommunities(communitiesAggiornate.filter(item => typeof item !== "undefined"))
}