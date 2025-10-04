import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import CommonDashboard from "../components/admin/CommonDashboard";
import CommonProductManagement from "../components/admin/CommonProductManagement";
import CommonCustomerManagement from "../components/admin/CommonCustomerManagement";
import CommonNotificationManagement from "../components/admin/CommonNotificationManagement";
import CommonSettings from "../components/admin/CommonSettings";
import CommonCustomerCare from "../components/admin/CommonCustomerCare";
import "../styles/AdminPage.css";

// Import dữ liệu từ books.js
import {
  newBooks,
  topSellingBooks,
  lifeSkillsBooks,
  childrenBooks,
  businessBooks,
  literatureBooks,
  summerBooks,
  thieuNhiBooks,
  parentingBooks,
  referenceBooks,
  toysBooks,
  beVaoLop1Books,
  tuDienTranhBooks,
  thuCongTapToBooks,
  phatTrienTriTueBooks,
  truyenCoTichBooks,
  sachHocTapBooks,
  sachKyNangSongBooks,
  sachKhamPhaBooks,
  kyNangGiaoTiepBooks,
  kyNangLanhDaoBooks,
  kyNangQuanLyBooks,
  kyNangMemBooks,
  khoiNghiepBooks,
  marketingBooks,
  quanTriBooks,
  taiChinhBooks,
  chamSocTreBooks,
  dinhDuongBooks,
  giaoDucSomBooks,
  sucKhoeBooks,
  tieuThuyetBooks,
  truyenNganBooks,
  thoCaBooks,
  tacPhamKinhDienBooks,
  toanHocBooks,
  vanHocBooks,
  lichSuBooks,
  diaLyBooks,
  doChoiGiaoDucBooks,
  butVietBooks,
  sachVoBooks,
  dungCuHocTapBooks,
} from "../data/books";
import CommonOrderManagement from "../components/admin/CommonOrderManagement";
import CommonCategoryManagement from "../components/admin/CommonCategoryManagement";

const { Sider, Content } = Layout;

const SalePage = () => {
  const [selectedKey, setSelectedKey] = useState(() => {
    // Lấy selectedKey từ localStorage hoặc mặc định là 'dashboard'
    const savedSelectedKey = localStorage.getItem("saleSelectedMenu");
    return savedSelectedKey || "dashboard";
  });

  // Đọc dữ liệu thông báo từ localStorage hoặc dùng dữ liệu mặc định
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("saleNotifications");
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    // Dữ liệu mặc định nếu chưa có
    return [
      {
        id: 1,
        title: "Khuyến mãi mùa hè",
        content: "Giảm giá 20% cho tất cả sách thiếu nhi",
        type: "promotion",
        status: "active",
        createdAt: "2024-06-01",
      },
      {
        id: 2,
        title: "Bảo trì hệ thống",
        content: "Hệ thống sẽ bảo trì từ 2h-4h sáng",
        type: "maintenance",
        status: "active",
        createdAt: "2024-06-02",
      },
    ];
  });

  const [settings, setSettings] = useState({
    companyName: "HIEU VINH BOOKSHOP",
    companyPhone: "0123456789",
    companyEmail: "info@hieuvinh.com",
    companyAddress: "123 Đường ABC, Quận 1, TP.HCM",
    companyDescription: "Nhà sách Hieu Vinh - Nơi tri thức lan tỏa",
    systemLanguage: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "VND",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    autoBackup: true,
  });

  // useEffect để lắng nghe thay đổi từ ManagePage
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "saleProducts") {
        setProducts(JSON.parse(e.newValue || "[]"));
      }
      if (e.key === "saleCustomers") {
        setCustomers(JSON.parse(e.newValue || "[]"));
      }
      if (e.key === "saleNotifications") {
        setNotifications(JSON.parse(e.newValue || "[]"));
      }
      if (e.key === "saleSettings") {
        setSettings(JSON.parse(e.newValue || {}));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAddNotification = (newNotification) => {
    // Tìm ID lớn nhất hiện tại và +1 để tránh trùng
    const maxId =
      notifications.length > 0
        ? Math.max(...notifications.map((n) => n.id))
        : 0;
    const notification = {
      ...newNotification,
      id: maxId + 1,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const newNotifications = [...notifications, notification];
    setNotifications(newNotifications);
    // Lưu vào localStorage
    localStorage.setItem("saleNotifications", JSON.stringify(newNotifications));
  };

  const handleEditNotification = (notificationId, updatedNotification) => {
    const newNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, ...updatedNotification } : n
    );
    setNotifications(newNotifications);
    // Lưu vào localStorage
    localStorage.setItem("saleNotifications", JSON.stringify(newNotifications));
  };

  const handleDeleteNotification = (notificationId) => {
    const newNotifications = notifications.filter(
      (n) => n.id !== notificationId
    );
    setNotifications(newNotifications);
    // Lưu vào localStorage
    localStorage.setItem("saleNotifications", JSON.stringify(newNotifications));
  };

  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    // Lưu vào localStorage
    localStorage.setItem("saleSettings", JSON.stringify(newSettings));
    return Promise.resolve();
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: "Quản lý hóa đơn",
    },
    {
      key: "products",
      icon: <BookOutlined />,
      label: "Quản lý sản phẩm",
    },
    {
      key: "categories",
      icon: <AppstoreAddOutlined />,
      label: "Quản lý danh mục",
    },
    {
      key: "customers",
      icon: <UserOutlined />,
      label: "Quản lý khách hàng",
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: "Quản lý thông báo",
    },
    {
      key: "customer-care",
      icon: <MessageOutlined />,
      label: "Chăm sóc khách hàng",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <CommonDashboard />;
      case "orders":
        return <CommonOrderManagement />;
      case "products":
        return <CommonProductManagement />;
      case "categories":
        return <CommonCategoryManagement />;
      case "customers":
        return <CommonCustomerManagement />;
      case "notifications":
        return (
          <CommonNotificationManagement
            notifications={notifications}
            onAddNotification={handleAddNotification}
            onEditNotification={handleEditNotification}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      case "customer-care":
        return <CommonCustomerCare />;
      case "settings":
        return (
          <CommonSettings
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        );
      default:
        return (
          <CommonDashboard
            stats={stats}
            recentOrders={recentOrders}
            topProducts={topProducts}
          />
        );
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider width={280} className="admin-sider">
        <div className="admin-logo">
          <h2>HIEUVINH SALE</h2>
        </div>
        <Menu
          className="admin-menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            setSelectedKey(key);
            // Lưu selectedKey vào localStorage
            localStorage.setItem("saleSelectedMenu", key);
          }}
        />
      </Sider>
      <Layout>
        <Content className="admin-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default SalePage;
