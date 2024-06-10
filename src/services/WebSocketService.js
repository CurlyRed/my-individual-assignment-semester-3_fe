import { Client } from '@stomp/stompjs';

const WEBSOCKET_BROKER_URL = import.meta.env.VITE_WEBSOCKET_BROKER_URL;

const WebSocketService = (() => {
    let client = null;

    const connect = (chatId, onMessageReceived) => {
        client = new Client({
            brokerURL: WEBSOCKET_BROKER_URL,
            reconnectDelay: 5000,
            debug: function (str) {
                console.log('WebSocket Debug: ', str);
            },
            onConnect: (frame) => {
                console.log('WebSocket Connected:', frame);

                // Subscribe to the specific chat topic
                const subscription = client.subscribe(`/topic/chat/${chatId}`, (message) => {
                    console.log(`Subscription successful to /topic/chat/${chatId}`);
                    console.log('Received message:', message);
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        console.log('Parsed message:', parsedMessage);
                        onMessageReceived(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                // Log subscription details
                console.log('Subscription details:', subscription);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
            }
        });

        client.activate();
    };

    const sendMessage = (chatId, message) => {
        if (client && client.connected) {
            const destination = `/app/message`;
            const payload = { ...message, chatId };
            client.publish({ destination, body: JSON.stringify(payload) });
            console.log(`Message sent to ${destination}: ${JSON.stringify(payload)}`);
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const disconnect = () => {
        if (client !== null) {
            client.deactivate();
            console.log('Disconnected from WebSocket');
        }
    };

    return {
        connect,
        sendMessage,
        disconnect
    };
})();

export default WebSocketService;