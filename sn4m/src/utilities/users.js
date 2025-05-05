export const getUsers = () => {
    return JSON.parse(localStorage.getItem("utenti"))
}

export const setUsers = (users) => {
    localStorage.setItem("utenti", JSON.stringify(users))
}

export const getUser = (email) => {
    return getUsers().find(item => item.email === email)
}

export const getLoggedUser = () => {
    return getUser(JSON.parse(sessionStorage.getItem("loginSession")).user)
}