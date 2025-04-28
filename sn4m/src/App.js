import {useState} from "react";
import Signin from "./pages/Signin";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import ProfiloUtente from "./pages/ProfiloUtente";


function App() {
    return (
        <>
            <div className="App">
                <div className={"container"}>
                    <Routes>
                        <Route path={"/"} element={<Signin/>}/>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/profiloUtente"} element={<ProfiloUtente/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
