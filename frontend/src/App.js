import React, {useEffect, useState} from 'react';
import axios from "axios";

const App = () => {

    const [backendData, setBackendData] = useState([{}]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/v1/brands');
                setBackendData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    },[]);

    return (
        <div>
            {(typeof backendData.users === 'undefined') ? (
                <p>Loading...</p>
            ) : (
                backendData.users.map((user, i) => (
                    <p key={i}>{user}</p>
                ))
            )}
        </div>
    );
};

export default App;
