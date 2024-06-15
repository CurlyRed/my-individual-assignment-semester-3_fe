import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTrash, FaUndo, FaArrowRight } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import WebSocketService from '../../../services/WebSocketService';
import ChatService from '../../../services/ChatService';
import UserService from '../../../services/UserService';
import ProductService from '../../../services/ProductService';
import TokenManager from '../../../services/TokenManager';

const Messages = () => {
    const location = useLocation();
    const initialState = location.state;

    const [activeTab, setActiveTab] = useState('Buying');
    const [chats, setChats] = useState([]);
    const [deletedChats, setDeletedChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [showDeletedChats, setShowDeletedChats] = useState(false);

    const [seller, setSeller] = useState(null);
    const [product, setProduct] = useState(null);
    const [userId, setUserId] = useState(TokenManager.getUserId());

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const fetchedChats = await ChatService.getChats(userId);
                const nonDeletedChats = fetchedChats.filter(chat => !chat.deleted);
                const deletedChats = fetchedChats.filter(chat => chat.deleted);
                setChats(nonDeletedChats);
                setDeletedChats(deletedChats);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchChats();
    }, [activeTab, userId]);

    useEffect(() => {
        if (selectedChat) {
            WebSocketService.connect(
                selectedChat.id,
                (receivedMessage) => {
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                }
            );

            return () => {
                WebSocketService.disconnect();
            };
        }
    }, [selectedChat]);

    useEffect(() => {
        if (initialState) {
            const fetchSellerAndProduct = async () => {
                try {
                    const sellerData = await UserService.getUser(initialState.sellerId);
                    const productData = await ProductService.getProduct(initialState.productId);
                    setSeller(sellerData);
                    setProduct(productData);
                } catch (error) {
                    toast.error('Failed to fetch seller or product information');
                }
            };

            fetchSellerAndProduct();
        }
    }, [initialState]);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const fetchedMessages = await ChatService.getMessages(selectedChat.id);
                    setMessages(fetchedMessages);
                } catch (error) {
                    toast.error(error.message);
                }
            };

            fetchMessages();
        }
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedChat(null);
        setMessages([]);
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleDeleteChat = async (chat) => {
        try {
            await ChatService.deleteChat(chat.id);
            setChats(chats.filter(c => c.id !== chat.id));
            setDeletedChats([...deletedChats, { ...chat, deleted: true }]);
            toast.success("Chat deleted! You can restore it from the bin.");
            if (selectedChat && selectedChat.id === chat.id) {
                setSelectedChat(null);
                setMessages([]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleRestoreChat = async (chat) => {
        try {
            await ChatService.recoverChat(chat.id);
            setDeletedChats(deletedChats.filter(c => c.id !== chat.id));
            setChats([...chats, { ...chat, deleted: false }]);
            toast.success("Chat restored!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSendMessage = async () => {
        let newMessage;
        if (selectedChat) {
            newMessage = {
                chatId: selectedChat.id,
                senderId: userId,
                content: message,
            };
            WebSocketService.sendMessage('/app/message', newMessage); 
            setMessage('');
        } else if (initialState) {
            const messageRequest = {
                chatId: null,
                senderId: userId,
                content: message,
                buyerId: initialState.buyerId,
                sellerId: initialState.sellerId,
                productId: initialState.productId
            };

            try {
                const createdChat = await ChatService.createChat(messageRequest);
                setChats((prevChats) => [...prevChats, createdChat]);
                setSelectedChat(createdChat);

                WebSocketService.connect(createdChat.id, (receivedMessage) => {
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });

                WebSocketService.sendMessage('/app/message', { ...messageRequest, chatId: createdChat.id });
                setMessage('');
            } catch (error) {
                console.error('Error creating chat or sending message:', error);
                toast.error('Failed to create chat or send message');
            }
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

    const getOpponentName = (chat) => {
        return chat.buyer.id === userId ? chat.seller.userInformation.firstName : chat.buyer.userInformation.firstName;
    };

    const filteredChats = chats.filter(chat => {
        return activeTab === 'Buying' ? chat.buyer.id === userId : chat.seller.id === userId;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        let daySuffix;
        if (day === 1 || day === 21 || day === 31) {
            daySuffix = 'st';
        } else if (day === 2 || day === 22) {
            daySuffix = 'nd';
        } else if (day === 3 || day === 23) {
            daySuffix = 'rd';
        } else {
            daySuffix = 'th';
        }

        return `${day}${daySuffix} ${month}, ${hours}:${minutes}`;
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
                        {filteredChats.map((chat, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-4 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() => handleChatSelect(chat)}
                            >
                                <div>
                                    <p className="font-bold">{chat.product.name}</p>
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
            <div className="flex-grow bg-white p-4 rounded shadow-lg h-full ml-4 flex flex-col">
                {(selectedChat || initialState) && (
                    <>
                        <div className="border-b border-gray-200 p-4">
                            <p className="font-bold text-xl">{selectedChat ? selectedChat.product.name : product?.name}</p>
                            <p className="text-sm text-gray-600">Chat with: {selectedChat ? getOpponentName(selectedChat) : seller?.userInformation.firstName}</p>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto">
                            {selectedChat ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 p-2 rounded-lg ${msg.sender.id === userId ? 'bg-amber-100 text-right ml-auto' : 'bg-gray-100 text-left mr-auto'}`}
                                    >
                                        <p className="font-bold">{msg.sender.userInformation.firstName}</p>
                                        <p>{msg.content}</p>
                                        <p className="text-xs text-gray-500">{formatDate(msg.timeStamp)}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-600">Start a conversation about this product</div>
                            )}
                            <div ref={messagesEndRef} />
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
                                        <p className="font-bold">{chat.product.name}</p>
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


