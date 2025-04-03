import {useEffect, useState} from "react";
import {getToken} from "../utilities/getToken";

export default function TagSelector({label, floatingLabel, placeholder, optionTitle}) {
    //Get Data to Fill Select
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

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

            setData(dati.artists.items);
        } catch (error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        if (search !== "") {
            getData(search);
        } else {
            setData([]);
        }
    }, [search]);

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
                            className="list-group-item flex-row"
                            key={item.id}
                            onClick={() => {
                                console.log("added")
                            }}
                        >
                            <img src={item.images[0]?.url} width={60} className={"m-2"}/>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className={"col-5"}>
            <div>
                Quadrato che mostra tag selezionati
            </div>
        </div>
    </div>)
}