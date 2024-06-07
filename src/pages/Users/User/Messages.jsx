import React, { useState, useEffect } from 'react';
import { FaTrash, FaUndo, FaArrowRight } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import { Stomp } from '@stomp/stompjs';
import ChatService from '../../../services/ChatService.js';
import TokenManager from '../../../services/TokenManager.js';

const SOCKET_URL = 'ws://localhost:8080/ws'; // Change protocol to ws:// for WebSocket

const Messages = ({ userId, username }) => {
    const [activeTab, setActiveTab] = useState('Buying');
    const [chats, setChats] = useState([]);
    const [deletedChats, setDeletedChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [showDeletedChats, setShowDeletedChats] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const fetchedChats = await ChatService.getChats(TokenManager.getUserId());
                setChats(fetchedChats);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchChats();
    }, [activeTab]);

    useEffect(() => {
        const socket = new WebSocket(SOCKET_URL);
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe('/user/topic/messages', (msg) => {
                const receivedMessage = JSON.parse(msg.body);
                setChats((prevChats) => {
                    const updatedChats = [...prevChats];
                    const chatIndex = updatedChats.findIndex(chat => chat.id === receivedMessage.chat.id);
                    if (chatIndex !== -1) {
                        updatedChats[chatIndex].messages.push(receivedMessage);
                        updatedChats[chatIndex].lastMessage = receivedMessage.content;
                    }
                    return updatedChats;
                });
            });

            client.subscribe('/user/topic/chats', (msg) => {
                const newChat = JSON.parse(msg.body);
                setChats((prevChats) => [...prevChats, newChat]);
            });
        });

        setStompClient(client);

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedChat(null);
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleDeleteChat = async (chat) => {
        try {
            await ChatService.deleteChat(chat.id);
            setChats(chats.filter(c => c.id !== chat.id));
            setDeletedChats([...deletedChats, chat]);
            toast.success("Chat deleted! You can restore it from the bin.");
            if (selectedChat && selectedChat.id === chat.id) {
                setSelectedChat(null);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleRestoreChat = async (chat) => {
        try {
            await ChatService.recoverChat(chat.id);
            setDeletedChats(deletedChats.filter(c => c.id !== chat.id));
            setChats([...chats, chat]);
            toast.success("Chat restored!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSendMessage = async () => {
        if (stompClient && selectedChat) {
            const newMessage = {
                chat: selectedChat,
                sender: { id: userId, username: username },
                content: message,
                timestamp: new Date()
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(newMessage));
            setMessage('');
        }
    };

    const toggleDeletedChats = () => {
        setShowDeletedChats(!showDeletedChats);
    };

    const closeModal = (e) => {
        if (e.target.id === 'modalBackdrop') {
            setShowDeletedChats(false);
        }
    };

    return (
        <div className="container mx-auto p-4 h-screen flex relative">
            <div className="w-1/4 bg-white p-4 rounded shadow-lg border-r border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex">
                        {['Buying', 'Selling'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-4 py-2 mr-2 ${activeTab === tab ? 'bg-amber-500 text-white' : 'bg-white text-amber-500 border border-amber-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" onClick={toggleDeletedChats} />
                </div>
                <div className="relative h-full">
                    <div className="w-full h-full overflow-y-auto">
                        {chats.map((chat, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-4 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() => handleChatSelect(chat)}
                            >
                                <div>
                                    <p className="font-bold">{chat.productName}</p>
                                    <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                                </div>
                                <button
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat(chat);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-grow bg-white p-4 rounded shadow-lg h-full ml-4">
                {selectedChat ? (
                    <>
                        <div className="border-b border-gray-200 p-4">
                            <p className="font-bold text-xl">{selectedChat.productName}</p>
                            <p className="text-sm text-gray-600">{selectedChat.productInfo}</p>
                            <p className="text-sm text-gray-600">Chat with: {selectedChat.opponentName}</p>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto">
                            {selectedChat.messages.map((msg, index) => (
                                <div key={index} className="mb-2">
                                    <p className="font-bold">{msg.sender}</p>
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 p-4 flex relative">
                            <input
                                type="text"
                                className="flex-grow p-2 border border-gray-300 rounded pr-10"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <FaArrowRight
                                onClick={handleSendMessage}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 cursor-pointer"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
            {showDeletedChats && (
                <div
                    id="modalBackdrop"
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div className="bg-white border border-gray-200 rounded shadow-lg p-4 w-1/3">
                        <h2 className="text-lg font-bold mb-4">Deleted Chats</h2>
                        {deletedChats.length === 0 ? (
                            <p className="text-sm text-gray-600">No deleted chats</p>
                        ) : (
                            deletedChats.map((chat, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer border-b"
                                    onClick={() => handleRestoreChat(chat)}
                                >
                                    <div>
                                        <p className="font-bold">{chat.productName}</p>
                                        <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                                    </div>
                                    <FaUndo className="text-blue-500 hover:text-blue-700" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default Messages;
