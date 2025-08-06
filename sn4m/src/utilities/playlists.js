export const getPlaylists = () => {       //recupera la voce "playlistProprie" da localStorage e trasforma il JSON in stringa
    return JSON.parse(localStorage.getItem("playlistProprie"))
}

export const setPlaylists = (playlists) => {    //prende oggetto playlists, lo trasforma in JSON e lo salva nel localStorage
    localStorage.setItem("playlistProprie", JSON.stringify(playlists))
}

export const getPlaylist = (id) => {           //recupera informazioni di una singola playlist
    return getPlaylists().find(item => item.id === id)        //se non trova nessuna playlist con id di input restituisce null
}

export const updatePlaylist = (playlist) => {   //ottiene la lista esistente di playlist dal localStorage.
    const existingPlaylists = getPlaylists()
    const playlists = existingPlaylists?.filter(item => item.id !== playlist.id)       //filtra quelle che hanno un ID diverso da quello della playlist da aggiornare.

    if (existingPlaylists) setPlaylists([...playlists, playlist])      //se c'erano playlist salvate: aggiunge quella nuova/aggiornata all’array filtrato e lo salva nel localStorage.
    else setPlaylists([playlist])                                           //Se no: crea un nuovo array con solo la playlist da aggiornare/inserire.
}