import {getUser} from "./users";

export const getCommunities = () => {       //recupera la voce "communities" da localStorage e trasforma il JSON in stringa
    return JSON.parse(localStorage.getItem("communities"))
}

export const setCommunities = (communities) => {    //prende oggetto communities, lo trasforma in JSON e lo salva nel localStorage
    localStorage.setItem("communities", JSON.stringify(communities))
}

export const getCommunity = (id) => {           //recupera informazioni di una singola community
    return getCommunities().find(item => item.idCommunity === id)        //se non trova nessuna community con id di input restituisce null
}

export const updateCommunity = (community) => {   //ottiene la lista esistente di community dal localStorage.
    const existingCommunities = getCommunities()
    const communities = existingCommunities?.filter(item => item.idCommunity !== community.idCommunity)       //filtra quelle che hanno un ID diverso da quello della community da aggiornare.

    if (existingCommunities) setCommunities([...communities, community])      //se c'erano community salvate: aggiunge quella nuova/aggiornata all’array filtrato e lo salva nel localStorage.
    else setCommunities([community])                                           //Se no: crea un nuovo array con solo la community da aggiornare/inserire.
}

export const getPlaylists = (community) => {            //restituisce tutte le playlist condivise all'interno di una determinata community
    const playlists = community.playlistCondivise                    //prende l'array delle playlist condivise dalla community

    const playlistsTrovate = []

    //cicla tutte le playlist condivise nella community
    playlists.forEach(playlist => {
        const autore = playlist.autore
        //cerca, tra le playlist proprie dell'autore, quella con lo stesso idPlaylist
        const playlistTrovata = autore.playlistProprie.find(item => item.idPlaylist === playlist.idPlaylist)
        //aggiunge la playlist trovata all'array di output
        playlistsTrovate.push(playlistTrovata)
    })

    return playlistsTrovate
}