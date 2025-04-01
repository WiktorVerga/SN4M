import {useState} from "react";
import Scheda from "./Components/scheda";


function App() {
    const [beers, setBeers] = useState([]);

    const handleClick = async () => {
        try {
            const resp = await fetch('https://api.sampleapis.com/beers/ale');
            const json = await resp.json();
            setBeers(json);
            console.log(beers);
        } catch (err) {
            setBeers(err.message);
        }

    }

    return (
        <div className="App">
            <h1 className={"btn"}>fdijsn</h1>
            <button onClick={() => handleClick()}>
                cliccami
            </button>

            {beers.length > 0 && beers.map(beer => (
                <Scheda key={beer.id} beer={beer} />
            ))
            }
        </div>
    );
}

export default App;
