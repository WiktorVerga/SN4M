export const getUsers = () => {
    return JSON.parse(localStorage.getItem("utenti"))
}

export const setUsers = (users) => {
    localStorage.setItem("utenti", JSON.stringify(users))
}

export const getUser = (username) => {
    return getUsers().find(item => item.username === username)
}