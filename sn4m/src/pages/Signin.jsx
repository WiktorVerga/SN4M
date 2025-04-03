import TagSelector from "../Components/TagSelector";

export default function Signin() {
    return (
        <div>
            <h1 className={"h1 p-5 text-center"}>
                Social Network for music
            </h1>
            <h3>
                Sign In
            </h3>

            <form name={"signin"} className={"mt-5"}>

                {/*Riga User e Email*/}
                <div className={"row flex-row justify-content-between"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="text" className="form-control" id="floatingInput"
                                   placeholder="username"/>
                            <label htmlFor="floatingInput">Username</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="email" className="form-control" id="floatingInput"
                                   placeholder="name@example.com"/>
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                    </div>
                </div>

                {/*Riga per Password*/}
                <div className={"row flex-row justify-content-between mt-5"}>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="floatingInput"
                                   placeholder="Password"/>
                            <label htmlFor="floatingInput">Password</label>
                        </div>
                    </div>
                    <div className={"col-5"}>

                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="floatingInput"
                                   placeholder="Ripeti Password"/>
                            <label htmlFor="floatingInput">Ripeti Password</label>
                        </div>
                    </div>
                </div>


                {/*Riga per Select Generi e Artisti*/}
                <TagSelector
                    label={"Artisti Preferiti"}
                    placeholder={"Cerca artisti preferiti"}
                    floatingLabel={"Cerca Artisti"}
                    optionTitle={"Artisti"}
                />

            </form>
        </div>
    )
};