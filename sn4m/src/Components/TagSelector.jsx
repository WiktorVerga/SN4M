import {useEffect, useState} from "react";
import {getToken} from "../functionalities/getToken";

export default function TagSelector({label, floatingLabel, placeholder, optionTitle}) {
    //Get Data to Fill Select
    const [data, setData] = useState();
    const [search, setSearch] = useState("");
    const [array, setArray] = useState([]);

    const getData = (query) => {
        try {
            fetch("https://api.spotify.com/v1/search?q=skrillex&type=artist", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer BQA3DXwPv4MX_61-VGofEHQav9niX-TXbrQp2iEc3UGJG5OBYKh2SHm390t7lKKVhsZfb3SiG1-Cxad2KWXhQdN6xxjbqv1C8ZRloQaCvm15SVf3DsZkWAHqdv7GLiHSGmO_npJdHUs`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    alert(res.message)
                }
            }).then(dati => setData(dati))
        } catch (error) {
            console.error('Errore:', error);
            return null;
        }
    }



    useEffect( () => {

        getData(search);
        if (data) {
            console.log(array[0])
        }


    }, [search]);

    return (
        <div className={"row flex-row justify-content-between mt-5"}>
            <div className={"col-5"}>
                <label htmlFor="floatingInput">{label}</label>
                <div className="form-floating mb-3 text-black">
                    <input type="text" className="form-control" id="search"
                           placeholder={placeholder} onChange={(e) => {setSearch(e.target.value)}}/>
                    <label htmlFor="floatingInput">{floatingLabel}</label>
                </div>

                <select className="form-select form-select-lg" aria-label="Scegli i tuoi Generi Preferiti">
                    <option selected>{optionTitle}</option>
                    {data && array.map(item => (
                        <option className={"text-black"} key={item.id} value={"dioporcoe"}></option>
                    ))}
                </select>
            </div>
            <div className={"col-5"}>
                <div>
                    Quadrato che mostra tag selezionati
                </div>
            </div>
        </div>
    )
}