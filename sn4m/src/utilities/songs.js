import {getToken} from "./getToken";

//funzione interna che trasforma i millisecondi in formato minuti:secondi
function msToMinutesSeconds(ms) {
    const date = new Date(ms);
    const formatter = new Intl.DateTimeFormat('it-IT', {
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);      //ritorna la stringa formattata MM:SS
}

export const getSong = async (idCanzone) => {
    const token = await getToken();         //ottiene token Spotify

    const url = "https://api.spotify.com/v1/tracks/" + idCanzone            //URL per la get

    try {
        //Effettua una richiesta GET all'API Spotify
        const response = await fetch(url, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }
        })

        //converte la risposta in JSON per poter leggere i dati della canzone
        const dati = await response.json();

        //crea un oggetto "song" con tutte le informazioni principali della traccia
        const song = {
            titolo: dati.name,
            durata: msToMinutesSeconds(dati.duration_ms),
            anno: dati.album.release_date.split("-")[0],
            img: dati.album.images[1],
            artista: dati.artists[0].name,
            idCanzone: dati.id
        }

        return song             //ritorna lista artisti
    } catch (error) {
        console.log(error.message);
    }
}

export const getSongs = async (idCanzoni) => {
    if (idCanzoni.length > 0) {
        const token = await getToken();         //ottiene token Spotify

        const stringIds = idCanzoni.join(',')

        const url = "https://api.spotify.com/v1/tracks?ids=" + stringIds            //URL per la get

        try {
            //Effettua una richiesta GET all'API Spotify
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            })

            //converte la risposta in JSON per poter leggere i dati della canzone
            const dati = await response.json();



            //crea un oggetto "song" con tutte le informazioni principali della traccia
            const canzoni = dati.tracks?.map(track => (
                {
                    titolo: track.name,
                    durata: msToMinutesSeconds(track.duration_ms),
                    anno: track.album.release_date.split("-")[0],
                    img: track.album.images[1],
                    artista: track.artists[0].name,
                    idCanzone: track.id
                }
            ))

            return canzoni             //ritorna lista artisti
        } catch (error) {
            console.log(error.message);
        }
    }

}

export const searchSong = async (searchTerm) => {
    const token = await getToken();         //ottiene token Spotify

    const url = "https://api.spotify.com/v1/search?type=track&q=" + searchTerm            //URL per la get

    try {
        //Effettua una richiesta GET all'API Spotify
        const response = await fetch(url, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }
        })

        //converte la risposta in JSON per poter leggere i dati della canzone
        const dati = await response.json();

        const songs = dati.tracks.items.map((track) => (
            {
                titolo: track.name,
                durata: msToMinutesSeconds(track.duration_ms),
                anno: track.album.release_date.split("-")[0],
                img: track.album.images[1],
                artista: track.artists[0].name,
                idCanzone: track.id
            }
        ))
        //crea un oggetto "song" con tutte le informazioni principali della traccia


        return songs             //ritorna lista artisti
    } catch (error) {
        console.log(error.message);
    }
}