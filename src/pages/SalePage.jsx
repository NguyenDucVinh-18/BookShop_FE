import React, { useContext, useState } from "react";
import { Layout, Menu, message } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BellOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import CommonDashboard from "../components/admin/CommonDashboard";
import CommonProductManagement from "../components/admin/CommonProductManagement";
import CommonCustomerManagement from "../components/admin/CommonCustomerManagement";
import CommonNotificationManagement from "../components/admin/CommonNotificationManagement";
import CommonCustomerCare from "../components/admin/CommonCustomerCare";
import "../styles/AdminPage.css";

import CommonOrderManagement from "../components/admin/CommonOrderManagement";
import CommonCategoryManagement from "../components/admin/CommonCategoryManagement";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";

const { Sider, Content } = Layout;

const SalePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [selectedKey, setSelectedKey] = useState(() => {
    const savedSelectedKey = localStorage.getItem("saleSelectedMenu");
    return savedSelectedKey || "dashboard";
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công");
    navigate("/employee/login");
    setUser(null);
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
      key: "logout",
      icon: <UserOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
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
        return <CommonNotificationManagement />;
      case "customer-care":
        return <CommonCustomerCare />;
      default:
        return <CommonDashboard />;
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider width={280} className="admin-sider">
        <div className="admin-logo">
          <h2>HIEUVINH SALE</h2>
          <h2>{user.username}</h2>
        </div>
        <Menu
          className="admin-menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            setSelectedKey(key);
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
