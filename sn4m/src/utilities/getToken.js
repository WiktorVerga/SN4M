export const getToken = async () => {

    try {
        //Invia una richiesta POST all’endpoint di Spotify per ottenere un token.

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.REACT_APP_CLIENT_SECRET,
            })
        });

        //Una volta ricevuta la risposta, la parsa in JSON.
        const token = await tokenResponse.json();

        //Ritorna solo il campo access_token
        return token.access_token;
    } catch (error) {
        console.log(error.message);
    }

}