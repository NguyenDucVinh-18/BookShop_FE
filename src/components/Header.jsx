import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, Input, Badge, Dropdown, Menu, message } from "antd";
import {
  SearchOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  CarOutlined,
  EnvironmentOutlined,
  FormOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import "../styles/Header.css";
import { AuthContext } from "./context/auth.context";
import { getAllCategoriesAPI } from "../service/category.service";
import {
  getAllNotificationsAPI,
  getCountUnreadNotificationsAPI,
  readAllNotificationAPI,
} from "../service/notification.service";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [listCategory, setListCategory] = useState([]);

  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const connectedRef = useRef(false);
  const [, setRefreshTime] = useState(Date.now()); // Để trigger re-render

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesAPI();
        if (res && res.data) {
          setListCategory(res.data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setListCategory([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    try {
      if (user && user.cartDetails) {
        const count = user?.cartDetails?.length || 0;
        setCartItemCount(count);
      } else {
        setCartItemCount(0);
      }
      fetchNotifications();
    } catch (error) {
      console.error("Error loading cart count:", error);
      setCartItemCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    const res = await getAllNotificationsAPI();
    const resCountUnread = await getCountUnreadNotificationsAPI();
    if (res && res.data) {
      setNotifications(res.data || []);
    }
    if(resCountUnread?.data) {
      if(resCountUnread.data?.data >= 0) {
        setNotificationCount(resCountUnread.data.data);
      } else {
        setNotificationCount(resCountUnread.data);
      }
    }  else {
      setNotificationCount(0);
    }
  };

  const handleReadAllNotifications = async () => {
    const res = await readAllNotificationAPI();
    if (res && res.data) {
      setNotificationCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    }
  };


  // 🔔 Kết nối WebSocket
  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    const socket = new SockJS("http://localhost:8080/chat-websocket");
    const client = over(socket);

    client.connect(
      {},
      () => {
        console.log("✅ Kết nối WebSocket thành công");

        client.subscribe("/topic/notifications", (msg) => {
          const promotion = JSON.parse(msg.body);

          // Cập nhật thông báo
          setNotificationCount((prev) => prev + 1);
          fetchNotifications();

          // Hiển thị thông báo nổi
          message.info({
            content: `🎉 Khuyến mãi mới: ${promotion.name} - Giảm ${promotion.discountPercent}%`,
            duration: 4,
          });
        });
      },
      (error) => console.error("❌ Lỗi WebSocket:", error)
    );

    setStompClient(client);

    return () => {
      if (client && client.connected) {
        client.disconnect(() => console.log("❌ Ngắt kết nối WebSocket"));
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 👤 Menu tài khoản
  const createUserMenuItems = () => {
    if (user && user.id) {
      return [
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Trang cá nhân",
          onClick: () => navigate("/profile"),
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick: handleLogout,
        },
      ];
    } else {
      return [
        {
          key: "login",
          icon: <FormOutlined />,
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        },
        {
          key: "register",
          icon: <UserOutlined />,
          label: "Đăng ký",
          onClick: () => navigate("/register"),
        },
      ];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  const createMenuItems = () => {
    return listCategory.map((cat) => ({
      key: `cat-${cat.id}`,
      label: cat.categoryName,
      children: cat.subCategories.map((sub) => ({
        key: `sub-${sub.id}`,
        label: sub.categoryName,
        onClick: () => navigate(`/productCategory/${cat.slug}/${sub.slug}`),
      })),
    }));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Format thời gian hiển thị
  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";
    
    try {
      const notificationDate = new Date(createdAt);
      const now = new Date();
      const diffMs = now - notificationDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      
      return notificationDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return createdAt;
    }
  };

  const notificationMenu = (
    <Menu
      style={{ maxHeight: 400, overflowY: "auto", minWidth: 300 }}
      items={
        notifications.length === 0
          ? [
              {
                key: "empty",
                label: (
                  <div style={{ textAlign: "center", color: "#888", padding: "10px 0" }}>
                    Không có thông báo nào
                  </div>
                ),
                disabled: true,
              },
            ]
          : [
              ...(notificationCount > 0
                ? [
                    {
                      key: "read-all",
                      label: (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#1890ff",
                            fontWeight: "bold",
                            padding: "5px 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          Đánh dấu tất cả đã đọc
                        </div>
                      ),
                      onClick: (e) => {
                        e.domEvent.stopPropagation();
                        handleReadAllNotifications();
                      },
                    },
                  ]
                : []),
              // Danh sách thông báo
              ...notifications.map((n, index) => {
                const isUnread = index < notificationCount;
                
                return {
                  key: n.id,
                  label: (
                    <div
                      // onClick={() => {
                      //   if (isUnread) {
                      //     handleMarkAsRead(n.id);
                      //   }
                      // }}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: isUnread ? "#e6f7ff" : "transparent",
                        borderLeft: isUnread ? "3px solid #1890ff" : "3px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        {isUnread && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#1890ff",
                              marginTop: 6,
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <strong
                            style={{
                              fontSize: 14,
                              color: isUnread ? "#000" : "#666",
                              fontWeight: isUnread ? "600" : "normal",
                            }}
                          >
                            {n.title}
                          </strong>
                          <div
                            style={{
                              fontSize: 12,
                              color: isUnread ? "#333" : "#888",
                              marginTop: 4,
                            }}
                          >
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#999",
                              marginTop: 4,
                            }}
                          >
                            {formatNotificationTime(n.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                };
              }),
            ]
      }
    />
  );

  return (
    <>
      <div className="top-bar">
        <div className="container"></div>
      </div>

      <header className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div
              className="logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <div className="logo-icon">📚</div>
              <div className="logo-text">
                <div className="logo-title">HIEUVINHbook</div>
                <div className="logo-subtitle">Ươm mầm tri thức</div>
              </div>
            </div>

            {/* Search */}
            <div className="search-section">
              <Input
                placeholder="Tìm kiếm..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="primary"
                className="search-button"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
              >
                <SearchOutlined />
                Tìm kiếm
              </Button>
            </div>

            {/* Icons */}
            <div className="user-icons">
              <Dropdown
                overlay={notificationMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="icon-item" style={{ cursor: "pointer" }}>
                  <Badge count={notificationCount}>
                    <BellOutlined className="icon" />
                  </Badge>
                  <span>Thông báo</span>
                </div>
              </Dropdown>

              {/* 🛒 Giỏ hàng */}
              <div
                className="icon-item"
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer" }}
              >
                <Badge count={cartItemCount}>
                  <ShoppingCartOutlined className="icon" />
                </Badge>
                <span>Giỏ hàng</span>
              </div>

              {/* 👤 Tài khoản */}
              <Dropdown
                menu={{ items: createUserMenuItems() }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="icon-item" style={{ cursor: "pointer" }}>
                  <UserOutlined className="icon" />
                  <span>
                    {user && user.id
                      ? `Xin chào, ${user.username || "Người dùng"}`
                      : "Tài khoản"}
                  </span>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <div className="navigation-bar">
        <div className="container">
          <div className="nav-content">
            <Dropdown
              menu={{ items: createMenuItems() }}
              trigger={["hover"]}
              placement="bottomLeft"
            >
              <div className="menu-trigger">
                <MenuOutlined className="menu-icon" />
                <span>DANH MỤC SẢN PHẨM</span>
              </div>
            </Dropdown>

            <div className="info-item">
              <CarOutlined className="info-icon" />
              <span>Ship COD Toàn Quốc</span>
            </div>

            <div
              className="info-item"
              onClick={() => navigate("/address")}
              style={{ cursor: "pointer" }}
            >
              <EnvironmentOutlined className="info-icon" />
              <span>Địa chỉ</span>
            </div>

            <div className="contact-info">
              <PhoneOutlined className="contact-icon" />
              <span>0966160925 / 0989849396</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;