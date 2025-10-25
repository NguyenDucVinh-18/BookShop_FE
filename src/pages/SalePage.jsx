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
  InboxOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  FileTextOutlined as FileTextIcon,
} from "@ant-design/icons";
import CommonDashboard from "../components/admin/CommonDashboard";
import CommonProductManagement from "../components/admin/CommonProductManagement";
import CommonCustomerManagement from "../components/admin/CommonCustomerManagement";
import CommonNotificationManagement from "../components/admin/CommonNotificationManagement";
import CommonCustomerCare from "../components/admin/CommonCustomerCare";
import CommonInventoryManagement from "../components/admin/CommonInventoryManagement";
import CreateImportExportForm from "../components/admin/CreateImportExportForm";
import ImportExportList from "../components/admin/ImportExportList";
import CreateInventoryCountForm from "../components/admin/CreateInventoryCountForm";
import InventoryCountManagement from "../components/admin/InventoryCountManagement";
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
  const [newSlip, setNewSlip] = useState(null);
  const [newCountSlip, setNewCountSlip] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công");
    navigate("/employee/login");
    setUser(null);
  };

  const handleCreateSlipSuccess = (slip) => {
    setNewSlip(slip);
    setSelectedKey("import-export-list");
    localStorage.setItem("saleSelectedMenu", "import-export-list");
  };

  const handleCreateNew = () => {
    setSelectedKey("create-import-export");
    localStorage.setItem("saleSelectedMenu", "create-import-export");
  };

  const handleCreateCountSlipSuccess = (countSlip) => {
    setNewCountSlip(countSlip);
    setSelectedKey("inventory-count-management");
    localStorage.setItem("saleSelectedMenu", "inventory-count-management");
  };

  const handleCreateNewCount = () => {
    setSelectedKey("create-inventory-count");
    localStorage.setItem("saleSelectedMenu", "create-inventory-count");
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
      key: "inventory",
      icon: <InboxOutlined />,
      label: "Quản lý kho",
      children: [
        {
          key: "create-import-export",
          icon: <PlusOutlined style={{ color: "#ff4d4f" }} />,
          label: "Tạo phiếu nhập xuất hàng",
        },
        {
          key: "import-export-list",
          icon: <UnorderedListOutlined />,
          label: "Danh sách phiếu nhập xuất",
        },
        {
          key: "create-inventory-count",
          icon: <FileTextIcon />,
          label: "Tạo phiếu kiểm kê",
        },
        {
          key: "inventory-count-management",
          icon: <FileTextIcon />,
          label: "Quản lý kiểm kê",
        },
      ],
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
      case "inventory":
        return <CommonInventoryManagement />;
      case "create-import-export":
        return <CreateImportExportForm onSuccess={handleCreateSlipSuccess} />;
      case "import-export-list":
        return <ImportExportList newSlip={newSlip} onCreateNew={handleCreateNew} />;
      case "create-inventory-count":
        return <CreateInventoryCountForm onSuccess={handleCreateCountSlipSuccess} />;
      case "inventory-count-management":
        return <InventoryCountManagement newCountSlip={newCountSlip} onCreateNew={handleCreateNewCount} />;
      default:
        return <CommonDashboard />;
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider width={320} className="admin-sider">
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
