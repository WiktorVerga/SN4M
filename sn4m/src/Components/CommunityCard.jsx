import TagDisplayer from "./TagDisplayer";

export default function CommunityCard({commmunity}) {
    return (
        <div className={"card mt-5 bg-primary text-white w-75 m-auto shadow"}>
            <div className={"card-body p-5"}>
                <div className={"row flex-row align-items-center"}>
                    <h2 className={"col"}>
                        {commmunity.titolo}
                    </h2>
                    <button className={"col-2 btn btn-primary text-uppercase"}>
                        unisciti
                    </button>
                </div>
                <div className={"row"}>
                    <p className={"w-50"}>
                        {commmunity.descrizione}
                    </p>
                </div>
                <TagDisplayer
                    tags={commmunity.tags}
                    withDelete={false}
                />

            </div>
        </div>
    )
}