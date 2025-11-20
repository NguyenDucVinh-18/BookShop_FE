import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Input } from "antd";
import { CustomerServiceOutlined, CloseOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { AuthContext } from "../context/auth.context";
import { getSockJSUrl } from "../../utils/websocketHelper";
import { readChatHistoryAPI } from "../../service/user.service";

const StaffChatWidget = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const stompClientRef = useRef(null);
  const chatEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  const customerId = user?.id || 1;

  const readAllChatMessages = async () => {
    setLoading(true);
    try {
      const res = await readChatHistoryAPI(customerId);
    } catch (error) {
      console.error("Error reading chat messages:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    readAllChatMessages();
  }, [customerId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (stompClientRef.current) return;

    const socket = new SockJS(getSockJSUrl("/chat-websocket"));
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect({}, () => {
      console.log("✅ Connected WebSocket");

      client.subscribe(`/topic/history/${customerId}`, (message) => {
        const history = JSON.parse(message.body);
        setMessages(
          history.map((msg) => ({
            id: msg.id,
            content: msg.message,
            type: msg.sentByCustomer ? "user" : "staff",
            timestamp: new Date(msg.createdAt),
          }))
        );
      });

      client.subscribe(`/topic/messages/${customerId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [
            ...prev,
            {
              id: msg.id || Date.now(),
              content: msg.message,
              type: msg.sentByCustomer ? "user" : "staff",
              timestamp: new Date(msg.createdAt),
            },
          ];
        });
      });

      client.send("/app/getMessages", {}, customerId.toString());
      stompClientRef.current = client;
    });

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect(() =>
          console.log("🔌 Disconnected WebSocket")
        );
      }
      stompClientRef.current = null;
    };
  }, [customerId]);

  const sendMessage = () => {
    if (!stompClientRef.current || input.trim() === "") return;

    const message = {
      message: input,
      customerId: customerId,
      senderId: user?.id || 1,
      senderRole: "CUSTOMER",
    };

    stompClientRef.current.send(
      "/app/sendMessage",
      {},
      JSON.stringify(message)
    );
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-widget">
      <div className="ai-chat-header" style={{ backgroundColor: "#2ecc71" }}>
        <div className="ai-avatar-container">
          <div className="ai-avatar-large">
            <CustomerServiceOutlined />
          </div>
        </div>
        <div className="ai-header-text">
          <div className="ai-greeting">Nhân viên hỗ trợ</div>
          <div className="ai-description">HIEUVINHbook sẵn sàng tư vấn</div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          className="ai-header-btn"
          onClick={onClose}
        />
      </div>

      <div className="ai-chat-messages">
        {messages.map((m, i) => (
          <div
            key={m.id || i}
            className={`ai-message ${
              m.type === "user" ? "user-message" : "ai-message"
            }`}
          >
            {m.type === "staff" && (
              <div className="ai-avatar-small">
                <CustomerServiceOutlined />
              </div>
            )}
            <div className="ai-message-content">
              <div className="ai-message-text">{m.content}</div>
              <div className="ai-message-time">
                {m.timestamp?.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="ai-chat-input">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập nội dung..."
          disabled={loading}
        />
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={sendMessage}
          disabled={!input.trim() || loading}
        >
          Gửi
        </Button>
      </div>

      <div className="ai-chat-footer">
        <div className="ai-brand">Hỗ trợ nhân viên</div>
        <div className="ai-time">
          {new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <style jsx>{`
        .ai-chat-input {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          padding: 12px;
        }

        .ai-input-field {
          flex: 1;
          order: 1;
        }

        .ai-send-button {
          flex-shrink: 0;
          order: 2;
        }
      `}</style>
    </div>
  );
};

export default StaffChatWidget;
