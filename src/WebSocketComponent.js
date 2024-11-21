// import React, { useEffect, useState, useRef } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// const WebSocketComponent = () => {
//     const [messages, setMessages] = useState([]);
//     const [connected, setConnected] = useState(false);
//     const [serialNumber, setSerialNumber] = useState("");
//     const [imeiNumber, setImeiNumber] = useState("");
//     const stompClientRef = useRef(null);

//     useEffect(() => {
//         const socket = new SockJS("http://127.0.0.1:9595/api/push/register"); // Replace with your server endpoint
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             debug: (str) => console.log(str),
//             onConnect: () => {
//                 console.log("Connected to WebSocket!");
//                 setConnected(true);

//                 // Subscribe to user-specific messages
//                 stompClient.subscribe("/user/queue/messages", (message) => {
//                     try {
//                         const parsedMessage = JSON.parse(message.body);
//                         setMessages((prevMessages) => [...prevMessages, parsedMessage]);
//                         console.log("Received message:", parsedMessage);
//                     } catch (error) {
//                         console.error("Error parsing message:", error);
//                     }
//                 });
//             },
//             onStompError: (frame) => {
//                 console.error("WebSocket error:", frame.headers["message"]);
//             },
//             onWebSocketError: (error) => {
//                 console.error("WebSocket connection error:", error);
//             },
//         });

//         stompClient.activate();
//         stompClientRef.current = stompClient;

//         return () => {
//             if (stompClient.active) {
//                 stompClient.deactivate();
//             }
//         };
//     }, []);

//     const sendRegisterRequest = () => {
//         if (connected && stompClientRef.current) {
//             const registerRequestBean = {
//                 serialNumber,
//                 imeiNumber,
//             };

//             stompClientRef.current.publish({
//                 destination: "/app/register",
//                 body: JSON.stringify(registerRequestBean),
//             });

//             console.log("Sent register request:", registerRequestBean);
//         } else {
//             console.warn("WebSocket is not connected!");
//         }
//     };

//     return (
//         <div>
//             <h1>WebSocket Client</h1>
//             <div>
//                 <label>
//                     Serial Number:
//                     <input
//                         type="text"
//                         value={serialNumber}
//                         onChange={(e) => setSerialNumber(e.target.value)}
//                     />
//                 </label>
//             </div>
//             <div>
//                 <label>
//                     IMEI Number:
//                     <input
//                         type="text"
//                         value={imeiNumber}
//                         onChange={(e) => setImeiNumber(e.target.value)}
//                     />
//                 </label>
//             </div>
//             <button onClick={sendRegisterRequest}>Send Register Request</button>
//             <div>
//                 <h2>Received Messages:</h2>
//                 <ul>
//                     {messages.map((message, index) => (
//                         <li key={index}>
//                             <strong>Operation Code:</strong> {message.operationCode || "N/A"}
//                             <br />
//                             <strong>Params:</strong>{" "}
//                             {message.params ? JSON.stringify(message.params) : "N/A"}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default WebSocketComponent;


import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [serialNumber, setSerialNumber] = useState("");
    const [imeiNumber, setImeiNumber] = useState("");
    const [operationCode, setOperationCode] = useState("");
    const [status, setStatus] = useState("");
    const [params, setParams] = useState({});
    const [paramKey, setParamKey] = useState("");
    const [paramValue, setParamValue] = useState("");
    const stompClientRef = useRef(null);

    useEffect(() => {
        // const socket = new SockJS("http://127.0.0.1:9595/api/push/register"); 
        const socket = new SockJS("http://127.0.0.1:9595/api/push/echo"); 
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to WebSocket!");
                setConnected(true);

                // Subscribe to user-specific messages
                stompClient.subscribe("/user/queue/messages", (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                        console.log("Received message:", parsedMessage);
                    } catch (error) {
                        console.error("Error parsing message:", error);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("WebSocket error:", frame.headers["message"]);
            },
            onWebSocketError: (error) => {
                console.error("WebSocket connection error:", error);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendRegisterRequest = () => {
        if (connected && stompClientRef.current) {
            const pushConfirmBean = {
                serialNumber,
                imeiNumber,
                operationCode,
                status,
                params,
            };

            stompClientRef.current.publish({
                destination: "/app/echo",
                body: JSON.stringify(pushConfirmBean),
            });

            console.log("Sent request:", pushConfirmBean);
        } else {
            console.warn("WebSocket is not connected!");
        }
    };

    const addParam = () => {
        if (paramKey && paramValue) {
            setParams((prevParams) => ({
                ...prevParams,
                [paramKey]: paramValue,
            }));
            setParamKey("");
            setParamValue("");
        }
    };

    return (
        <div>
            <h1>WebSocket Client</h1>
            <div>
                <label>
                    Serial Number:
                    <input
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    IMEI Number:
                    <input
                        type="text"
                        value={imeiNumber}
                        onChange={(e) => setImeiNumber(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Operation Code:
                    <input
                        type="text"
                        value={operationCode}
                        onChange={(e) => setOperationCode(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Status:
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <h3>Add Params:</h3>
                <input
                    type="text"
                    placeholder="Key"
                    value={paramKey}
                    onChange={(e) => setParamKey(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Value"
                    value={paramValue}
                    onChange={(e) => setParamValue(e.target.value)}
                />
                <button onClick={addParam}>Add Param</button>
                <div>
                    <h4>Current Params:</h4>
                    <ul>
                        {Object.entries(params).map(([key, value], index) => (
                            <li key={index}>
                                {key}: {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={sendRegisterRequest}>Send Register Request</button>
            <div>
                <h2>Received Messages:</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>Serial Number:</strong> {message.serialNumber || "N/A"}
                            <br />
                            <strong>Operation Code:</strong> {message.operationCode || "N/A"}
                            <br />
                            <strong>Status:</strong> {message.status || "N/A"}
                            <br />
                            <strong>Params:</strong>{" "}
                            {message.params ? JSON.stringify(message.params) : "N/A"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketComponent;
