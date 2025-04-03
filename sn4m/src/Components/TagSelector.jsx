import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";
import TagConChiusura from "./TagConChiusura";

export default function TagSelector({label, floatingLabel, placeholder, optionTitle}) {
    //Get Data to Fill Select
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    //Artists and Genres
    const [savedArtists, setSavedArtists] = useState([]);

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

    const handleChoice = (e) => {
        const addElement = e.target.getAttribute('value')
        const searchInput = document.getElementById('search')
        setSavedArtists(prevSelectedItems => [...prevSelectedItems, addElement]);
        setSearch("")
        searchInput.value = "";
    }

    const handleDelete = (elem) => {
        setSavedArtists(prevSelectedItems => prevSelectedItems.filter(item => item !== elem));
    }

    useEffect(() => {
        if (search !== "") {
            getData(search).then((dati) => {
                //Filtro per rimuovere dalle ricerche gli artisti già inseriti
                const availableArtists = dati.filter(item =>
                    !savedArtists.includes(item.name)
                );
                setData(availableArtists)
            })
        } else {
            setData([]);
        }
    }, [search, savedArtists]);

    return (<div className={"row flex-row justify-content-between mt-5"}>
        <div className={"col-5"}>
            <label htmlFor="floatingInput">{label}</label>
            <div className="form-floating mb-3 text-black">
                <input type="text" className="form-control" id="search"
                       placeholder={placeholder} onChange={(e) => {
                    setSearch(e.target.value)
                }}/>
                <label htmlFor="floatingInput">{floatingLabel}</label>
                <ul className="list-group">
                    {data?.map((item) => (
                        <li
                            className="list-group-item flex-row cursor-pointer"
                            key={item.id}
                            value={item.name}
                            onClick={(e) => {
                                handleChoice(e);
                            }}
                        >
                            <img src={item.images[0]?.url} width={60} height={60} className={"m-2 rounded-2"}/>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className={"col-5"}>
            <div className={"tag-displayer"}>
                {savedArtists.length > 0 ? savedArtists.map((item) => (
                    <TagConChiusura value={item} handleDelete={() => {handleDelete(item)}} />
                )) : <p className={"text-white-50"}>Aggiungi Artisti...</p>
                }
            </div>
        </div>
    </div>)
}