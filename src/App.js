import { useState, useEffect } from "react";

const url = "http://localhost:5000";

function App() {

    const [items, setItems] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        GetItems();

    }, []);

  

    const GetItems = async() => {
       await fetch(url + "/items")
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.log(err));
    };

   

    const CompleteItem = async(id) => {
        const data = await fetch(url  + "/item/complete/" + id, {method:"PUT"})
        .then(res => res.json());

        setItems(items => items.map(item => {
                if (item._id === data._id){
                     item.completed = data.completed
                }
                return item;
            })
        );
    };




    const postItem = async () => {
        const data = await fetch(url + "/item/new/", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: newItem
                })
                }).then(res => res.json());
        
        setItems([...items, data]);
        setPopupActive(false);
        setNewItem("");
    };
 



    const deleteItem = async (id) => {
        const data = await fetch(url + "/item/delete/" +id, {method: "DELETE"})
        .then(res => res.json());

        setItems(items => items.filter(item => item._id !== data._id));
    };

    

    return (
        <div className="App">
            <div className="header">
            <h1>Welcome</h1> 
            </div>
            <h4>Your Tasks</h4>
                <div >
                {items.map(item => (
                    <div
                        className={ "item" + (item.completed ? " completed" : "")}
                        key={item._id}
                        onClick={() => CompleteItem(item._id)}
                    >
                        <div className="checkbox"></div>

                        <div className="text"> {item.text} </div>

                        <div className="delete-item"
                             onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item._id);
                            }}
                        >x</div>
                    </div>
                ))}
                
                </div>

            <div className="button" onClick={() => setPopupActive(true)}> + </div>
            
            {popupActive ? (
                <div className="popup">
                    <div className="closePopup"
                         onClick={() => setPopupActive(false)}
                    >x
                    </div>
                    <div className="content">
                        <h3>Add Task</h3>
                        <input
                            type="text"
                            className="item-input"
                            onChange={(e) => setNewItem(e.target.value)}
                            value={newItem}
                        />
                        <div className="button" onClick={newItem !== "" ? postItem : undefined}>
                            +
                        </div>
                    </div>
                </div>
            ) : undefined}
            
        </div>
    );
}

export default App;
