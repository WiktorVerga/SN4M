import {getToken} from "./getToken";

export const getSong = async (idCanzone) => {
    const token = await getToken();         //ottiene token Spotify

    const url = "https://api.spotify.com/v1/tracks/" + idCanzone

    try {
        const response = await fetch(url, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }
        })

        const dati = await response.json();


        function msToMinutesSeconds(ms) {
            const date = new Date(ms);
            const formatter = new Intl.DateTimeFormat('it-IT', {
                minute: '2-digit',
                second: '2-digit'
            });
            return formatter.format(date);
        }

        console.log(dati);

        const song = {
            titolo: dati.name,
            durata: msToMinutesSeconds(dati.duration_ms),
            album: dati.album.name,
            img: dati.album.images[1],
            artista: dati.artists[0].name,
            idCanzone: dati.id
        }

        console.log(song);

        return song             //ritorna lista artisti
    } catch (error) {
        console.log(error.message);
    }
}