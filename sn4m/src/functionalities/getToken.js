

export const getToken = async () => {
    console.log(process.env.CLIENT_SECRET)
    try {
        // Richiesta del token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: "f1b2adf9fc34a0f97af6ed784638b1d",
                client_secret: "fa2b5bff05344238be7925d40a8e55ab",
            })
        });

        console.log(tokenResponse);

        return tokenResponse.json();
    }catch (error) {
        console.log(error.message);
    }

    }