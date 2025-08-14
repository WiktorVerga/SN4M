import {getCommunities, getCommunity} from "./communities";

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

    if (!user) return null           //se non esiste, interrompe

    const communities = getCommunities()        //recupera tutte le community

    const myCommunities = communities?.filter(item => user.communities.includes(item.idCommunity))   //filtra quelle in cui l'utente loggato è presente

    return myCommunities
}

export const cleanCommunities = () => {
    const user = getLoggedUser()        //recupera l'utente loggato

    const communitiesAggiornate = user.communities.filter(item => getCommunities().some(community => community.idCommunity === item))

    //crea una copia con le community aggiornate dell'utente
    const utenteAggiornato = {
        ...user,
        communities: communitiesAggiornate
    }

    updateUser(utenteAggiornato)            //aggiorna dati dell'utente nello storage
}