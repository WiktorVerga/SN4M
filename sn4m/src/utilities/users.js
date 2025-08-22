import {getCommunities, getCommunity} from "./communities";

//Restituisce la prima lettera del nome utente di un utente dato il suo ID
export const getLetter = (idUtente) => {
    const user = getUser(idUtente);     //recupera l'utente dal localStorage

    //se l'utente non esiste, ritorna undefined
    if (user === null) return

    //restituisce la prima lettera del username e la converte in maiuscolo
    return user?.username.charAt(0).toUpperCase()
}

//restituisce tutti gli utenti salvati nel localStorage
export const getUsers = () => {
    return JSON.parse(localStorage.getItem("utenti"))
}

//salva oggetto users, convertendolo in json nel localStorage
export const setUsers = (users) => {
    localStorage.setItem("utenti", JSON.stringify(users))
}

//cerca un utente nella lista degli utenti nel localStorage, confrontando idUtente.
export const getUser = (idUtente) => {
    return getUsers().find(item => item.idUtente === idUtente)
}

//recupera l'utente attualmente loggato.
export const getLoggedUser = () => {

    if (sessionStorage.getItem("loginSession") === null)        //Controlla se esiste una sessione salvata nel sessionStorage.
        return null

    const loggedUser = getUser(JSON.parse(sessionStorage.getItem("loginSession")).user)     //parse e ottiene i dati dell'utente presente nel sessionStorage

    if (loggedUser === undefined) return null

    return loggedUser
}

//rimuove la sessione attiva dal sessionStorage, effettuando il logout dell’utente.
export const logout = () => {
    sessionStorage.removeItem("loginSession")
}

//aggiorna un utente nel localStorage
export const updateUser = (user) => {
    const existingUsers = getUsers()
    const users = existingUsers?.filter(item => item.idUtente !== user.idUtente)  //rimuove l’utente con la stesso idUtente, così da poterlo aggiornare.

    if (existingUsers) setUsers([...users, user])      //se c’erano utenti già salvati: salva la lista aggiornata
    else setUsers([user])       //Se no: crea una nuova lista con l’utente passato.
}

//restituisce le community a cui l'utente loggato è iscritto o ha creato
export const getUserCommunities = () => {
    const user = getLoggedUser()        //recupera l'utente loggato

    if (!user) return null           //se non esiste, interrompe

    const communities = getCommunities()        //recupera tutte le community

    const myCommunities = communities?.filter(item => user.communities.includes(item.idCommunity))   //filtra quelle in cui l'utente loggato è presente

    return myCommunities
}

//Pulisce le iscrizioni dell'utente alle community che non esistono più
export const cleanSubscribedCommunities = () => {
    const user = getLoggedUser()        //recupera l'utente loggato

    //controlla l'esistenza dell'utente
    if (typeof user === 'undefined' || user === null) {
        return null
    } else {
        //mantiene solo le community esistenti
        const communitiesAggiornate = user?.communities?.filter(item => getCommunities().some(community => community.idCommunity === item))

        //aggiorna la lista community dell'utente
        const utenteAggiornato = {
            ...user,
            communities: communitiesAggiornate
        }

        updateUser(utenteAggiornato)            //salva modifiche nello storage
    }
}

//Pulisce le playlist salvate dall'utente rimuovendo quelle non più condivise
export const cleanPlaylistSalvate = () => {
    const user = getLoggedUser()        //recupera l'utente loggato

    //controlla l'esistenza dell'utente
    if (typeof user === 'undefined' || user === null) {
        return null
    } else {
        //Per ogni playlist salvata, controllo se nella community da cui è stata salvata è ancora condivisa, se no restituisce undefined
        const playlistSalvateAggiornate = user?.playlistSalvate.map((playlistSalvata) => {

            //Recupero la community da cui è stata salvata la playlist
            const communty = getCommunity(playlistSalvata.idCommunity)

            //se la community non esiste, ritorna undefined
            if (typeof communty === null) {
                return undefined
            } else {
                const esisteAncora = communty?.playlistCondivise.some(item => item.idCondivisione === playlistSalvata.idCondivisione)
                return esisteAncora? playlistSalvata : undefined
            }
        })

        //mantiene solo se la playlist è ancora condivisa
        user.playlistSalvate = playlistSalvateAggiornate?.filter(item => typeof item !== "undefined")

        updateUser(user)        //salva le modifiche dell'utente nello storage
    }
}

