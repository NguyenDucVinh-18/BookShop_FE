import React, { useState, useEffect } from "react";
import {
    Input,
    Button,
    Avatar,
    Typography,
    Badge,
    Tooltip,
    message,
    Empty
} from "antd";
import {
    SearchOutlined,
    PhoneOutlined,
    VideoCameraOutlined,
    MoreOutlined,
    SendOutlined,
    SmileOutlined,
    PaperClipOutlined,
    UserOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons";
import "../../styles/CustomerCare.css";

const { Text, Title } = Typography;

const CommonCustomerCare = () => {
    // State cho danh sách cuộc trò chuyện
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('customerCareConversations');
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                customerName: "Nguyễn Văn A",
                customerPhone: "0123456789",
                lastMessage: "Tôi muốn hỏi về sách toán lớp 5",
                lastMessageTime: "10:30",
                unreadCount: 2,
                status: "online",
                avatar: null
            },
            {
                id: 2,
                customerName: "Trần Thị B",
                customerPhone: "0987654321",
                lastMessage: "Cảm ơn bạn, tôi sẽ đặt hàng",
                lastMessageTime: "09:45",
                unreadCount: 0,
                status: "offline",
                avatar: null
            },
            {
                id: 3,
                customerName: "Lê Văn C",
                customerPhone: "0369852147",
                lastMessage: "Sách có còn hàng không ạ?",
                lastMessageTime: "08:20",
                unreadCount: 1,
                status: "online",
                avatar: null
            },
            {
                id: 4,
                customerName: "Phạm Thị D",
                customerPhone: "0741236985",
                lastMessage: "Tôi cần tư vấn về sách tiếng Anh",
                lastMessageTime: "Hôm qua",
                unreadCount: 0,
                status: "offline",
                avatar: null
            }
        ];
    });

    // State cho cuộc trò chuyện đang chọn
    const [selectedConversation, setSelectedConversation] = useState(null);

    // State cho tin nhắn trong cuộc trò chuyện
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('customerCareMessages');
        return saved ? JSON.parse(saved) : {
            1: [
                { id: 1, sender: 'customer', content: 'Chào bạn, tôi muốn hỏi về sách toán lớp 5', timestamp: '10:25', type: 'text' },
                { id: 2, sender: 'staff', content: 'Chào anh/chị! Tôi có thể tư vấn về sách toán lớp 5. Anh/chị cần sách gì cụ thể ạ?', timestamp: '10:26', type: 'text' },
                { id: 3, sender: 'customer', content: 'Tôi cần sách bài tập toán lớp 5 của NXB Giáo dục', timestamp: '10:28', type: 'text' },
                { id: 4, sender: 'staff', content: 'Dạ, sách bài tập toán lớp 5 NXB Giáo dục hiện còn hàng. Giá 45.000đ. Anh/chị có muốn đặt không ạ?', timestamp: '10:30', type: 'text' }
            ],
            2: [
                { id: 1, sender: 'customer', content: 'Tôi muốn đặt sách văn học', timestamp: '09:40', type: 'text' },
                { id: 2, sender: 'staff', content: 'Chào anh/chị! Sách văn học nào anh/chị quan tâm ạ?', timestamp: '09:42', type: 'text' },
                { id: 3, sender: 'customer', content: 'Truyện Kiều và các tác phẩm của Nguyễn Du', timestamp: '09:43', type: 'text' },
                { id: 4, sender: 'staff', content: 'Dạ, chúng tôi có bộ sưu tập đầy đủ tác phẩm Nguyễn Du. Tổng cộng 320.000đ. Anh/chị có muốn đặt không?', timestamp: '09:45', type: 'text' },
                { id: 5, sender: 'customer', content: 'Cảm ơn bạn, tôi sẽ đặt hàng', timestamp: '09:45', type: 'text' }
            ],
            3: [
                { id: 1, sender: 'customer', content: 'Chào shop, sách có còn hàng không ạ?', timestamp: '08:15', type: 'text' },
                { id: 2, sender: 'staff', content: 'Chào anh/chị! Sách nào anh/chị quan tâm ạ?', timestamp: '08:16', type: 'text' },
                { id: 3, sender: 'customer', content: 'Sách có còn hàng không ạ?', timestamp: '08:20', type: 'text' }
            ],
            4: [
                { id: 1, sender: 'customer', content: 'Tôi cần tư vấn về sách tiếng Anh cho trẻ em', timestamp: 'Hôm qua 14:30', type: 'text' },
                { id: 2, sender: 'staff', content: 'Chào chị! Chúng tôi có nhiều sách tiếng Anh cho trẻ em. Chị muốn cho bé mấy tuổi ạ?', timestamp: 'Hôm qua 14:32', type: 'text' },
                { id: 3, sender: 'customer', content: 'Bé 6 tuổi, mới bắt đầu học tiếng Anh', timestamp: 'Hôm qua 14:35', type: 'text' },
                { id: 4, sender: 'staff', content: 'Dạ, chúng tôi có bộ sách "My First English" rất phù hợp. Chị có muốn xem không ạ?', timestamp: 'Hôm qua 14:36', type: 'text' }
            ]
        };
    });

    // State cho tin nhắn mới
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Lưu dữ liệu vào localStorage khi có thay đổi
    useEffect(() => {
        localStorage.setItem('customerCareConversations', JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        localStorage.setItem('customerCareMessages', JSON.stringify(messages));
    }, [messages]);

    // Lọc cuộc trò chuyện theo tìm kiếm
    const filteredConversations = conversations.filter(conv =>
        conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.customerPhone.includes(searchTerm)
    );

    // Chọn cuộc trò chuyện
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        // Xóa unread count khi chọn cuộc trò chuyện
        if (conversation.unreadCount > 0) {
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === conversation.id
                        ? { ...conv, unreadCount: 0 }
                        : conv
                )
            );
        }
    };

    // Gửi tin nhắn
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageId = Date.now();
        const newMsg = {
            id: messageId,
            sender: 'staff',
            content: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        // Thêm tin nhắn vào danh sách
        setMessages(prev => ({
            ...prev,
            [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg]
        }));

        // Cập nhật tin nhắn cuối trong danh sách cuộc trò chuyện
        setConversations(prev =>
            prev.map(conv =>
                conv.id === selectedConversation.id
                    ? {
                        ...conv,
                        lastMessage: newMessage.trim(),
                        lastMessageTime: newMsg.timestamp
                    }
                    : conv
            )
        );

        setNewMessage('');
        message.success('Tin nhắn đã được gửi');
    };

    // Xử lý phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="customer-care-container">
            <div className="customer-care-header">
                <Title level={3}>Chăm sóc khách hàng</Title>
                <Text type="secondary">Quản lý tin nhắn và hỗ trợ khách hàng</Text>
            </div>

            <div className="customer-care-content">
                {/* Danh sách cuộc trò chuyện - Left Panel */}
                <div className="conversations-panel">
                    <div className="conversations-header">
                        <Input
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="conversations-search"
                        />
                    </div>

                    <div className="conversations-list">
                        {filteredConversations.length === 0 ? (
                            <Empty description="Không tìm thấy cuộc trò chuyện nào" />
                        ) : (
                            filteredConversations.map(conversation => (
                                <div
                                    key={conversation.id}
                                    className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(conversation)}
                                >
                                    <div className="conversation-avatar">
                                        <Badge
                                            dot={conversation.status === 'online'}
                                            color={conversation.status === 'online' ? '#52c41a' : '#d9d9d9'}
                                        >
                                            <Avatar
                                                size={48}
                                                icon={<UserOutlined />}
                                                className="conversation-avatar-img"
                                            />
                                        </Badge>
                                    </div>

                                    <div className="conversation-content">
                                        <div className="conversation-header">
                                            <Text strong className="conversation-name">
                                                {conversation.customerName}
                                            </Text>
                                            <Text type="secondary" className="conversation-time">
                                                {conversation.lastMessageTime}
                                            </Text>
                                        </div>

                                        <div className="conversation-preview">
                                            <Text
                                                type="secondary"
                                                className="conversation-message"
                                                ellipsis={{ tooltip: conversation.lastMessage }}
                                            >
                                                {conversation.lastMessage}
                                            </Text>
                                            {conversation.unreadCount > 0 && (
                                                <Badge count={conversation.unreadCount} size="small" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Khung chat - Right Panel */}
                <div className="chat-panel">
                    {selectedConversation ? (
                        <>
                            {/* Header cuộc trò chuyện */}
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined />}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-user-details">
                                        <Text strong className="chat-user-name">
                                            {selectedConversation.customerName}
                                        </Text>
                                        <Text type="secondary" className="chat-user-phone">
                                            {selectedConversation.customerPhone}
                                        </Text>
                                    </div>
                                </div>

                                <div className="chat-actions">
                                    <Tooltip title="Gọi điện">
                                        <Button type="text" icon={<PhoneOutlined />} />
                                    </Tooltip>
                                    <Tooltip title="Video call">
                                        <Button type="text" icon={<VideoCameraOutlined />} />
                                    </Tooltip>
                                    <Tooltip title="Thêm">
                                        <Button type="text" icon={<MoreOutlined />} />
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Khu vực tin nhắn */}
                            <div className="chat-messages">
                                {messages[selectedConversation.id]?.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`message ${msg.sender === 'staff' ? 'message-sent' : 'message-received'}`}
                                    >
                                        {msg.sender === 'customer' && (
                                            <Avatar size={32} icon={<UserOutlined />} className="message-avatar" />
                                        )}

                                        <div className="message-content">
                                            <div className="message-bubble">
                                                <Text className="message-text">{msg.content}</Text>
                                            </div>
                                            <Text type="secondary" className="message-time">
                                                {msg.timestamp}
                                            </Text>
                                        </div>

                                        {msg.sender === 'staff' && (
                                            <Avatar size={32} icon={<CustomerServiceOutlined />} className="message-avatar" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Khu vực nhập tin nhắn */}
                            <div className="chat-input">
                                <div className="chat-input-actions">
                                    <Button type="text" icon={<SmileOutlined />} />
                                    <Button type="text" icon={<PaperClipOutlined />} />
                                </div>

                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập tin nhắn..."
                                    className="chat-input-field"
                                />

                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="chat-send-button"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="chat-empty">
                            <Empty
                                description="Chọn một cuộc trò chuyện để bắt đầu"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommonCustomerCare;
