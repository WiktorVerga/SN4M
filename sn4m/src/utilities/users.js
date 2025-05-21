import {useNavigate} from "react-router-dom";

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
    if (sessionStorage.getItem("loginSession") === null)

        return null

    const loggedUser = getUser(JSON.parse(sessionStorage.getItem("loginSession")).user)
    if (loggedUser === undefined) return null

    return loggedUser
}

export const logout = () => {
    sessionStorage.removeItem("loginSession")
}

export const updateUser = (user) => {
    const existingUsers = getUsers()
    const users = existingUsers?.filter(item => item.email !== user.email)
    if (existingUsers) setUsers([...users, user])
    else setUsers([user])
}