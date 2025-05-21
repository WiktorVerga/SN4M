export const getCommunities = () => {
    return JSON.parse(localStorage.getItem("communities"))
}

export const setCommunities = (communities) => {
    localStorage.setItem("communities", JSON.stringify(communities))
}

export const getCommunity = (id) => {
    return getCommunities().find(item => item.id === id)
}

export const updateCommunity = (community) => {
    const existingCommunities = getCommunities()
    const communities = existingCommunities?.filter(item => item.id !== community.id)
    if (existingCommunities) setCommunities([...communities, community])
    else setCommunities([community])
}