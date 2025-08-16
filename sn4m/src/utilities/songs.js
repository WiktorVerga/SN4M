import {getToken} from "./getToken";

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

        //funzione interna che trasforma i millisecondi in formato minuti:secondi
        function msToMinutesSeconds(ms) {
            const date = new Date(ms);
            const formatter = new Intl.DateTimeFormat('it-IT', {
                minute: '2-digit',
                second: '2-digit'
            });
            return formatter.format(date);      //ritorna la stringa formattata MM:SS
        }

        //crea un oggetto "song" con tutte le informazioni principali della traccia
        const song = {
            titolo: dati.name,
            durata: msToMinutesSeconds(dati.duration_ms),
            album: dati.album.name,
            img: dati.album.images[1],
            artista: dati.artists[0].name,
            idCanzone: dati.id
        }

        return song             //ritorna lista artisti
    } catch (error) {
        console.log(error.message);
    }
}