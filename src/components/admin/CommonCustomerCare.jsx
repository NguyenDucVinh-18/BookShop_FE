import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Input,
  Button,
  Avatar,
  Typography,
  Badge,
  Empty,
} from "antd";
import {
  SearchOutlined,
  SendOutlined,
  UserOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../../styles/CustomerCare.css";
import { AuthContext } from "../context/auth.context";

const { Text, Title } = Typography;

const CommonCustomerCare = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat-websocket");
    const client = Stomp.over(socket);
    client.debug = () => {}; 
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("✅ Connected to WebSocket");

      client.subscribe("/topic/conversations", (msg) => {
        setConversations(JSON.parse(msg.body));
      });

      client.send("/app/getConversations", {}, {});
    });

    return () => {
      if (client && client.connected) client.disconnect();
    };
  }, []);

  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !client.connected || !selectedConversation) return;

    const customerId = selectedConversation.customer.id;

    const msgSub = client.subscribe(`/topic/messages/${customerId}`, (msg) => {
      const newMsg = JSON.parse(msg.body);
      setMessages((prev) => [...prev, newMsg]);
    });

    const historySub = client.subscribe(`/topic/history/${customerId}`, (msg) => {
      setMessages(JSON.parse(msg.body));
    });

    client.send("/app/getMessages", {}, JSON.stringify(customerId));

    return () => {
      msgSub.unsubscribe();
      historySub.unsubscribe();
    };
  }, [selectedConversation]);

  const handleSendMessage = () => {
    const client = stompClientRef.current;
    if (!newMessage.trim() || !selectedConversation || !client?.connected) return;

    const msgObj = {
      message: newMessage,
      customerId: selectedConversation.customer.id,
      senderId: user?.id || 1,
      senderRole: "STAFF",
    };

    client.send("/app/sendMessage", {}, JSON.stringify(msgObj));
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const filteredConversations = conversations.filter((conv) => {
    const name = conv.customer?.username || "";
    const phone = conv.customer?.phone || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });


  return (
    <div className="customer-care-container">
      <div className="customer-care-header">
        <Title level={3}>💬 Chăm sóc khách hàng</Title>
        <Text type="secondary">
          Quản lý tin nhắn & hỗ trợ khách hàng realtime
        </Text>
      </div>

      <div className="customer-care-content">
        {/* 📋 DANH SÁCH HỘI THOẠI */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="conversations-search"
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <Empty description="Không có cuộc trò chuyện nào" />
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${
                    selectedConversation?.id === conv.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-avatar">
                    <Badge dot color="#52c41a">
                      <Avatar
                        size={48}
                        src={conv.customer?.avatarUrl}
                        icon={<UserOutlined />}
                      />
                    </Badge>
                  </div>
                  <div className="conversation-content">
                    <Text strong>{conv.customer?.username || "Khách hàng"}</Text>
                    <Text type="secondary">
                      {conv.lastMessage || "Không có tin nhắn"}
                    </Text>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 💬 KHUNG CHAT */}
        <div className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <Avatar
                    size={40}
                    src={selectedConversation.customer?.avatarUrl}
                    icon={<UserOutlined />}
                  />
                  <div>
                    <Text strong>
                      {selectedConversation.customer?.username}
                    </Text>
                    <Text type="secondary">
                      {selectedConversation.customer?.phone}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, index) => {
                  const isStaff = msg.senderRole === "STAFF" || msg.employee;
                  return (
                    <div
                      key={msg.id || index}
                      className={`message ${isStaff ? "message-sent" : "message-received"}`}
                    >
                      {!isStaff && (
                        <Avatar
                          size={32}
                          src={selectedConversation.customer?.avatarUrl}
                          icon={<UserOutlined />}
                        />
                      )}
                      <div className="message-content">
                        <div className="message-bubble">
                          <Text>{msg.message}</Text>
                        </div>
                        <Text type="secondary" className="message-time">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </Text>
                      </div>
                      {isStaff && (
                        <Avatar size={32} icon={<CustomerServiceOutlined />} />
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  Gửi
                </Button>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <Empty description="Chọn một cuộc trò chuyện để bắt đầu" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonCustomerCare;
