

// import React, { useEffect, useState, useRef } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// const WebSocketComponent = () => {
//     const [messages, setMessages] = useState([]);
//     const [connected, setConnected] = useState(false);
//     const [serialNumber, setSerialNumber] = useState("");
//     const [imeiNumber, setImeiNumber] = useState("");
//     const stompClientRef = useRef(null); // Use a ref to store the stompClient instance

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
//                     const parsedMessage = JSON.parse(message.body);
//                     setMessages((prevMessages) => [...prevMessages, parsedMessage]);
//                     console.log("Received message:", parsedMessage);
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
//         stompClientRef.current = stompClient; // Store the client instance in the ref

//         // Clean up the WebSocket connection on component unmount
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

//             // Send message to /app/register endpoint
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
//                         <li key={index}>{JSON.stringify(message)}</li>
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
    const stompClientRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS("http://127.0.0.1:9595/api/push/register"); // Replace with your server endpoint
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
            const registerRequestBean = {
                serialNumber,
                imeiNumber,
            };

            stompClientRef.current.publish({
                destination: "/app/register",
                body: JSON.stringify(registerRequestBean),
            });

            console.log("Sent register request:", registerRequestBean);
        } else {
            console.warn("WebSocket is not connected!");
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
            <button onClick={sendRegisterRequest}>Send Register Request</button>
            <div>
                <h2>Received Messages:</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <strong>Operation Code:</strong> {message.operationCode || "N/A"}
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
