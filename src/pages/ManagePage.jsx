import React, { useContext, useState, useEffect } from "react";
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
  Drawer,
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
  MenuOutlined,
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProductInventoryPage from "../components/admin/ProductInventoryPage";

const { Sider, Content } = Layout;

const ManagePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the section from URL path
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === "/manager") return "dashboard";
    const match = path.match(/\/manager\/(.+)/);
    return match ? match[1] : "dashboard";
  };

  const [selectedKey, setSelectedKey] = useState(getCurrentSection());
  const [newSlip, setNewSlip] = useState(null);
  const [newCountSlip, setNewCountSlip] = useState(null);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update selectedKey when URL changes
  React.useEffect(() => {
    const section = getCurrentSection();
    setSelectedKey(section);
    localStorage.setItem("managerSelectedMenu", section);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công");
    navigate("/employee/login");
    setUser(null);
  };

  const handleCreateSlipSuccess = (slip) => {
    setNewSlip(slip);
    navigate("/manager/import-export-list");
  };

  const handleCreateNew = () => {
    navigate("/manager/create-import-export");
  };

  const handleCreateCountSlipSuccess = (countSlip) => {
    setNewCountSlip(countSlip);
    navigate("/manager/inventory-count-management");
  };

  const handleCreateNewCount = () => {
    navigate("/manager/create-inventory-count");
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

  const menuContent = (
    <>
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
          if (key !== "logout") {
            // Navigate to the corresponding URL
            if (key === "dashboard") {
              navigate("/manager");
            } else {
              navigate(`/manager/${key}`);
            }
            // Close mobile menu after navigation
            if (isMobile) {
              setMobileMenuVisible(false);
            }
          }
        }}
      />
    </>
  );

  return (
    <Layout className="admin-layout">
      {/* Mobile Header */}
      {isMobile && (
        <div className="admin-mobile-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{ fontSize: "20px", color: "#1890ff" }}
          />
          <h2>HIEUVINH MANAGE</h2>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider width={280} className="admin-sider">
          {menuContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={280}
          bodyStyle={{ padding: 0, background: "#001529" }}
          headerStyle={{ background: "#001529", border: "none" }}
          styles={{
            header: { background: "#001529" },
            body: { background: "#001529" },
          }}
        >
          {menuContent}
        </Drawer>
      )}

      <Layout>
        <Content className="admin-content">{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default ManagePage;
