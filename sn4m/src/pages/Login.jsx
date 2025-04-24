export default function Login() {
    return (
        <div>
            <h1 className={"h1 p-5 text-center text-uppercase"}>
                Social Network for Music
            </h1>
            <div>
                <h3>Log In</h3>
                <form
                    name={"login"}
                    className={"mt-5"}
                >
                    <div className={""}>
                        <div className="form-floating mb-3 text-black ">
                            <input type="text" className="form-control" id="username"
                                   autoComplete={"off"}
                                   required={true}
                                   placeholder="username"
                                   onChange={(e) => {
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Username</label>
                            <div className="invalid-feedback">errore</div>
                        </div>

                    </div>
                    <div className={"col-5"}>
                        <div className="form-floating mb-3 text-black">
                            <input type="password" className="form-control" id="password"
                                   required={true}
                                   placeholder="Password"
                                   onChange={(e) => {
                                       e.target.classList.remove("is-invalid")
                                   }}
                            />
                            <label htmlFor="floatingInput">Password</label>
                            <div className="invalid-feedback">errore</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}