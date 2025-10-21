import React, { useContext, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Row,
  Col,
  Card,
  Select,
  InputNumber,
  message,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  BellOutlined,
  TeamOutlined,
  GiftOutlined,
  FileTextOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

import CommonDashboard from "../components/admin/CommonDashboard";
import CommonProductManagement from "../components/admin/CommonProductManagement";
import CommonCustomerManagement from "../components/admin/CommonCustomerManagement";
import CommonNotificationManagement from "../components/admin/CommonNotificationManagement";

import "../styles/AdminPage.css";

import EmployeeManagement from "../components/admin/EmployeeManagement";
import { AuthContext } from "../components/context/auth.context";
import CommonOrderManagement from "../components/admin/CommonOrderManagement";
import CommonCategoryManagement from "../components/admin/CommonCategoryManagement";
import PromotionManagement from "../components/admin/PromotionManagement";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const ManagePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState(() => {
    // Lấy trạng thái menu từ localStorage khi khởi tạo
    const savedMenu = localStorage.getItem("managerSelectedMenu");
    return savedMenu || "dashboard";
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
      key: "employees",
      icon: <TeamOutlined />,
      label: "Quản lý nhân viên",
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: "Quản lý thông báo",
    },
    {
      key: "promotions",
      icon: <GiftOutlined />,
      label: "Quản lý khuyến mãi",
    },
    {
      key: "logout",
      icon: <UserOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
    // {
    //     key: 'settings',
    //     icon: <SettingOutlined />,
    //     label: 'Cài đặt'
    // }
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
      case "employees":
        return <EmployeeManagement />;
      case "promotions":
        return <PromotionManagement />;
      // case 'settings':
      //     return (
      //         <CommonSettings
      //             settings={settings}
      //             onSaveSettings={handleSaveSettings}
      //         />
      //     );
      default:
        return <CommonDashboard />;
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider width={280} className="admin-sider">
        <div className="admin-logo">
          <h2>HIEUVINH MANAGE</h2>
          <h2>{user.username}</h2>
        </div>
        <Menu
          className="admin-menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            setSelectedKey(key);
            // Lưu selectedKey vào localStorage
            localStorage.setItem("managerSelectedMenu", key);
          }}
        />
      </Sider>
      <Layout>
        <Content className="admin-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default ManagePage;
