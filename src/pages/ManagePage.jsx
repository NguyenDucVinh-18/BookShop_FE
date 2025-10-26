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
  InboxOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  FileTextOutlined as FileTextIcon,
  ArrowLeftOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

import CommonDashboard from "../components/admin/CommonDashboard";
import CommonProductManagement from "../components/admin/CommonProductManagement";
import CommonCustomerManagement from "../components/admin/CommonCustomerManagement";
import CommonNotificationManagement from "../components/admin/CommonNotificationManagement";
import CommonInventoryManagement from "../components/admin/CommonInventoryManagement";
import CreateImportExportForm from "../components/admin/CreateImportExportForm";
import ImportExportList from "../components/admin/ImportExportList";
import CreateInventoryCountForm from "../components/admin/CreateInventoryCountForm";
import InventoryCountManagement from "../components/admin/InventoryCountManagement";

import "../styles/AdminPage.css";

import EmployeeManagement from "../components/admin/EmployeeManagement";
import { AuthContext } from "../components/context/auth.context";
import CommonOrderManagement from "../components/admin/CommonOrderManagement";
import CommonCategoryManagement from "../components/admin/CommonCategoryManagement";
import PromotionManagement from "../components/admin/PromotionManagement";
import { useNavigate } from "react-router-dom";
import ProductInventoryPage from "../components/admin/ProductInventoryPage";

const { Sider, Content } = Layout;

const ManagePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedKey, setSelectedKey] = useState(() => {
    // Lấy trạng thái menu từ localStorage khi khởi tạo
    const savedMenu = localStorage.getItem("managerSelectedMenu");
    return savedMenu || "dashboard";
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
    localStorage.setItem("managerSelectedMenu", "import-export-list");
  };

  const handleCreateNew = () => {
    setSelectedKey("create-import-export");
    localStorage.setItem("managerSelectedMenu", "create-import-export");
  };

  const handleCreateCountSlipSuccess = (countSlip) => {
    setNewCountSlip(countSlip);
    setSelectedKey("inventory-count-management");
    localStorage.setItem("managerSelectedMenu", "inventory-count-management");
  };

  const handleCreateNewCount = () => {
    setSelectedKey("create-inventory-count");
    localStorage.setItem("managerSelectedMenu", "create-inventory-count");
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
      key: "inventory",
      icon: <InboxOutlined />,
      label: "Quản lý kho",
      children: [
        {
          key: "product-quantity",
          icon: <DatabaseOutlined style={{ color: "#52c41a" }} />,
          label: "Số lượng sản phẩm",
        },
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
      case "inventory":
        return <CommonInventoryManagement />;
      case "product-quantity":
        return <ProductInventoryPage />;
      case "create-import-export":
        return <CreateImportExportForm onSuccess={handleCreateSlipSuccess} />;
      case "import-export-list":
        return <ImportExportList newSlip={newSlip} onCreateNew={handleCreateNew} />;
      case "create-inventory-count":
        return <CreateInventoryCountForm onSuccess={handleCreateCountSlipSuccess} />;
      case "inventory-count-management":
        return <InventoryCountManagement newCountSlip={newCountSlip} onCreateNew={handleCreateNewCount} />;
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
