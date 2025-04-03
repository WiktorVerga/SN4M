import {useState} from "react";
import Scheda from "./Components/scheda";
import Signin from "./pages/Signin";
import {BrowserRouter, Route, Routes} from "react-router-dom";


function App() {
    return (
        <>
            <div className="App">
                <div className={"container"}>
                    <Routes>
                        <Route path={"/"} element={<Signin/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
