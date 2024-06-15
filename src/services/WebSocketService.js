import { Client } from '@stomp/stompjs';

const WEBSOCKET_BROKER_URL = import.meta.env.VITE_WEBSOCKET_BROKER_URL;

const WebSocketService = (() => {
    let client = null;
    let isConnected = false;
    let pendingMessages = [];

    const connect = (chatId, onMessageReceived) => {
        if (isConnected && client) {
            console.log(`Already connected to WebSocket`);
            return;
        }

        client = new Client({
            brokerURL: WEBSOCKET_BROKER_URL,
            reconnectDelay: 5000,
            debug: function (str) {
                console.log('WebSocket Debug: ', str);
            },
            onConnect: (frame) => {
                isConnected = true;

                client.subscribe(`/topic/chat/${chatId}`, (message) => {
                    try {
                        const parsedMessage = JSON.parse(message.body);
                        onMessageReceived(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });

                pendingMessages.forEach(({ destination, message }) => sendMessage(destination, message));
                pendingMessages = [];
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onWebSocketClose: () => {
                isConnected = false;
            }
        });

        client.activate();
    };

    const sendMessage = (destination, message) => {
        if (isConnected && client && client.connected) {
            client.publish({
                destination,
                body: JSON.stringify(message),
            });
        } else {
            console.error('WebSocket is not connected, storing message in pending messages');
            pendingMessages.push({ destination, message });
        }
    };

    const disconnect = () => {
        if (client !== null) {
            client.deactivate();
            isConnected = false;
        }
    };

    return {
        connect,
        sendMessage,
        disconnect
    };
})();

export default WebSocketService;
