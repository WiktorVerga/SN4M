import {Link} from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5 navbar-ff">
            <div className="container">
                <div className="d-flex">
                    {/* Identità del progetto */}
                    <div className="col-3 mb-3 mx-auto">
                        <h5 className="fw-bold">Social Network for Music</h5>
                        <p className="small">
                            Progetto universitario sviluppato per il corso di Applicazioni Web e Cloud –
                            {/* Link all'università */}
                            <Link className={"text-white text-decoration-none"} to={"https://www.unimi.it/it"}>Università degli Studi di Milano.</Link>
                        </p>
                    </div>

                    {/* Credits */}
                    <div className="col-3 mb-3 mx-auto">
                        <h6 className="fw-bold">Credits</h6>
                        <p className="small mb-1">Team: Wiktor Verga 41644A, <br/>Giorgia Fontana 43206A</p>
                        <p className="small mb-1">Docenti: Claudio Agostino Ardagna, Valerio Bellandi</p>
                        <p className="small">Anno Accademico 2024/2025</p>
                    </div>

                    {/* Navigazione rapida */}
                    <div className="col-3 mb-3 mx-auto">
                        <h6 className="fw-bold">Link utili</h6>
                        <ul className="list-unstyled">
                            <li><a href="/esplora" className="text-light text-decoration-none">Home</a></li>
                            <li><a href="/tueCommunities" className="text-light text-decoration-none">Communities</a></li>
                            <li><a href="/playlists" className="text-light text-decoration-none">Libreria Playlist</a></li>
                            <li><a href="/profiloUtente" className="text-light text-decoration-none">Il Tuo Profilo</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-light" />

                {/* Footer bottom con anno */}
                <div className="text-center small">
                    {new Date().getFullYear()} - SN4M
                </div>
            </div>
        </footer>
    )
}