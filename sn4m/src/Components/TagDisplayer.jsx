import TagConChiusura from "./TagConChiusura";

export default function TagDisplayer({tags, emsg, handleDelete}) {
    return (
        <div className={"tag-displayer"}>
            {tags?.length > 0 ? tags.map((item, index) => (
                <TagConChiusura key={index} value={item} handleDelete={() => {
                    handleDelete(item)
                }}/>
            )) : <p className={"text-white-50"}>{emsg}</p>
            }
        </div>
    )
}