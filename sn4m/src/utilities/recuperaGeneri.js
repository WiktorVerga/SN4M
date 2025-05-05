import {getToken} from "./getToken";

export const recuperaGeneri = async (artistiPreferiti) => {

    //Set per evitare duplicati
    const generi = new Set()

    //Funzione per recuperare i dati di un singolo artista
    const getData = async (query) => {

        const token = await getToken();

        const url = "https://api.spotify.com/v1/search?q=" + query + "&type=artist"

        try {
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            })

            const dati = await response.json();

            return dati.artists.items
        } catch (error) {
            console.log(error.message);
        }

    }

    //Recupero dei generi per ogni artista preferito
    for (let i in artistiPreferiti) {
        const data = await getData(artistiPreferiti[i])

        data[0]?.genres.forEach((genre) => {
            if (genre)
                generi.add(genre)
        })
    }

    return Array.from(generi)
}