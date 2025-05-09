export const getCommunities = () => {
    return JSON.parse(localStorage.getItem("communities"))
}

export const setCommunities = (communities) => {
    localStorage.setItem("communities", JSON.stringify(communities))
}