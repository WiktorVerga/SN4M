import {getToken} from "./getToken";
import {getPlaylist} from "./playlists";

//Funzione interna che trasforma i millisecondi in formato minuti:secondi
function msToMinutesSeconds(ms) {
    const date = new Date(ms);
    const formatter = new Intl.DateTimeFormat('it-IT', {
        minute: '2-digit',       //formatta i minuti con due cifre
        second: '2-digit'       //formatta i secondi con due cifre
    });
    return formatter.format(date);      //ritorna la stringa formattata MM:SS
}

//Recupera i dati di una singola canzone tramite Spotify API
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

        return song             //ritorna oggetto canzone
    } catch (error) {
        console.log(error.message);
    }
}

//Recupera i dati di più canzoni tramite un array di ID
export const getSongs = async (idCanzoni) => {
    if (idCanzoni.length > 0) {
        const token = await getToken();         //ottiene token Spotify

        const stringIds = idCanzoni.join(',')       //unisce gli ID in una stringa separata da virgole

        const url = "https://api.spotify.com/v1/tracks?ids=" + stringIds            //URL per la get su più tracce

        try {
            //Effettua una richiesta GET all'API Spotify
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            })

            //converte la risposta in JSON per poter leggere i dati della canzone
            const dati = await response.json();

            //crea un oggetto "song" per ogni canzone restituita con tutte le informazioni principali della traccia
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

            return canzoni             //ritorna lista canzoni
        } catch (error) {
            console.log(error.message);
        }
    }

}

//Cerca canzoni su Spotify tramite termine di ricerca
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

        //trasforma ogni risultato in oggetto canzone leggibile
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

        return songs             //ritorna lista canzoni
    } catch (error) {
        console.log(error.message);
    }
}

//Verifica se una canzone è già stata aggiunta a una playlist
export const songAlreadyAdded = (idPlaylist, idCanzone) => {
    //controlla se tra le canzoni della playlist esiste già l'ID della canzone
    return getPlaylist(idPlaylist)?.canzoni?.some((item) => item === idCanzone)
}