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
import { getSockJSUrl } from "../../utils/websocketHelper";

const { Text, Title } = Typography;

const CommonCustomerCare = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentOpenCustomerIdRef = useRef(null); // theo dõi hội thoại đang mở (tránh state bị stale trong callback)
  const topicSubsRef = useRef({}); // subscriptions theo customerId để cập nhật preview/unread
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const socket = new SockJS(getSockJSUrl("/chat-websocket"));
    const client = Stomp.over(socket);
    client.debug = () => { };
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("✅ Connected to WebSocket");

      client.subscribe("/topic/conversations", (msg) => {
        const incoming = JSON.parse(msg.body) || [];
        // Merge để không mất lastMessage/unreadCount vừa cập nhật từ socket
        setConversations((prev) => {
          const prevByKey = new Map(
            (prev || []).map((c) => [String(c.id ?? c.customer?.id), c])
          );
          const merged = incoming.map((c) => {
            const key = String(c.id ?? c.customer?.id);
            const old = prevByKey.get(key) || {};
            return {
              ...c,
              lastMessage: c.lastMessage ?? old.lastMessage ?? "",
              lastMessageAt: c.lastMessageAt ?? old.lastMessageAt,
              unreadCount: old.unreadCount || 0,
            };
          });
          return merged;
        });
      });

      client.send("/app/getConversations", {}, {});
    });

    return () => {
      if (client && client.connected) client.disconnect();
    };
  }, []);

  // Đăng ký lắng nghe tin nhắn cho TẤT CẢ hội thoại để cập nhật preview/unread
  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !client.connected) return;

    const existingSubs = topicSubsRef.current || {};

    // Tạo subs cho các hội thoại mới
    conversations.forEach((c) => {
      const cid = c?.customer?.id;
      if (!cid) return;
      if (existingSubs[cid]) return; // đã có

      const sub = client.subscribe(`/topic/messages/${cid}`, (msg) => {
        const newMsg = JSON.parse(msg.body);

        // Nếu message đến cho hội thoại này, cập nhật preview & badge và đẩy lên đầu danh sách
        setConversations((prev) => {
          const updated = prev.map((conv) => {
            if (conv?.customer?.id !== cid) return conv;
            const isOpen = String(currentOpenCustomerIdRef.current ?? "") === String(cid);
            const isFromCustomer = newMsg.senderRole !== "STAFF" && !newMsg.employee;
            return {
              ...conv,
              lastMessage: newMsg.message,
              lastMessageAt: newMsg.createdAt,
              unreadCount: (conv.unreadCount || 0) + (isOpen || !isFromCustomer ? 0 : 1),
            };
          });
          // Sort: tin mới nhất lên đầu
          updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
          return updated;
        });
      });

      existingSubs[cid] = sub;
    });

    // Hủy subs cho hội thoại không còn trong danh sách
    Object.keys(existingSubs).forEach((cid) => {
      const stillExists = conversations.some((c) => String(c?.customer?.id) === String(cid));
      if (!stillExists) {
        try { existingSubs[cid].unsubscribe(); } catch { }
        delete existingSubs[cid];
      }
    });

    topicSubsRef.current = existingSubs;

    return () => {
      // Không cleanup toàn bộ ở đây để giữ subs khi conversations thay đổi nhẹ
    };
  }, [conversations, selectedConversation]);

  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !client.connected || !selectedConversation) return;

    const customerId = selectedConversation.customer.id;
    // cập nhật ref hội thoại đang mở
    currentOpenCustomerIdRef.current = customerId;

    const msgSub = client.subscribe(`/topic/messages/${customerId}`, (msg) => {
      const newMsg = JSON.parse(msg.body);
      setMessages((prev) => [...prev, newMsg]);

      // Cập nhật preview và badge chưa đọc cho danh sách hội thoại
      setConversations((prev) => {
        const mapped = prev.map((c) => {
          const isSame = c.customer?.id === (newMsg.customerId || newMsg.customer?.id);
          if (!isSame) return c;

          const isCurrentOpen =
            String(currentOpenCustomerIdRef.current ?? "") ===
            String(newMsg.customerId || newMsg.customer?.id || customerId);

          const isFromCustomer = newMsg.senderRole !== "STAFF" && !newMsg.employee;
          const shouldIncrement =
            isFromCustomer && (!isCurrentOpen || document.visibilityState !== "visible");
          return {
            ...c,
            lastMessage: newMsg.message,
            lastMessageAt: newMsg.createdAt,
            unreadCount: (c.unreadCount || 0) + (shouldIncrement ? 1 : 0),
          };
        });
        // Sort: tin mới nhất lên đầu
        mapped.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
        return mapped;
      });
    });

    const historySub = client.subscribe(`/topic/history/${customerId}`, (msg) => {
      const list = JSON.parse(msg.body);
      setMessages(list);

      // Đồng bộ preview từ lịch sử (tin nhắn cuối cùng)
      if (Array.isArray(list) && list.length > 0) {
        const last = list[list.length - 1];
        setConversations((prev) =>
          prev.map((c) =>
            c.customer?.id === customerId
              ? { ...c, lastMessage: last.message, lastMessageAt: last.createdAt }
              : c
          )
        );
      }
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


  // Sắp xếp theo thời gian tin nhắn cuối cùng (mới nhất lên trước) rồi mới filter
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b?.lastMessageAt || 0) - new Date(a?.lastMessageAt || 0)
  );

  const filteredConversations = sortedConversations.filter((conv) => {
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
                  className={`conversation-item ${selectedConversation?.id === conv.id ? "active" : ""
                    }`}
                  onClick={() => {
                    setSelectedConversation(conv);
                    // Reset badge chưa đọc khi mở hội thoại
                    setConversations((prev) =>
                      prev.map((c) => {
                        const sameByConvId = c.id && conv.id && c.id === conv.id;
                        const sameByCustomerId =
                          c.customer?.id && conv.customer?.id && c.customer.id === conv.customer.id;
                        return sameByConvId || sameByCustomerId
                          ? { ...c, unreadCount: 0 }
                          : c;
                      })
                    );
                  }}
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
                    <Text strong>
                      {conv.customer?.username || "Khách hàng"}
                    </Text>
                    <div className="conversation-preview">
                      <span className="conversation-message">
                        {conv.lastMessage || "Không có tin nhắn"}
                      </span>
                      {Boolean(conv.unreadCount) && conv.unreadCount > 0 && (
                        <Badge
                          count={conv.unreadCount}
                          size="small"
                          style={{ backgroundColor: '#f5222d' }}
                        />
                      )}
                    </div>
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
