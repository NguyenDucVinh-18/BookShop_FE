import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Badge,
  Dropdown,
  Menu,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  CarOutlined,
  BookOutlined,
  HomeOutlined,
  ReadOutlined,
  GiftOutlined,
  FormOutlined,
  TrophyOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { AuthContext } from "./context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Thêm useLocation hook
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  console.log("Header user:", user);

  // Load cart items count and check authentication status from localStorage on component mount
  useEffect(() => {
    const loadCartCount = () => {
      try {
        if (user && user.cartDetails) {
          const count = user?.cartDetails?.length || 0;
          setCartItemCount(count);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error loading cart count:", error);
        setCartItemCount(0);
      }
    };

    const checkAuthStatus = () => {
      try {
        const authUser = localStorage.getItem("access_token");
        if (authUser) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };


    // Load initially
    loadCartCount();
    checkAuthStatus();

    // Listen for storage changes (when localStorage is modified from other components)
    const handleStorageChange = (e) => {
      if (e.key === "shoppingCart") {
        loadCartCount();
      } else if (e.key === "authUser") {
        checkAuthStatus();
      }
    };

    // Listen for custom event when cart is updated
    const handleCartUpdated = () => {
      loadCartCount();
    };

    const handleAuthUserUpdated = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("authUserUpdated", handleAuthUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("authUserUpdated", handleAuthUserUpdated);
    };
  }, [location.pathname, user]); // Thêm location.pathname vào dependency array

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      message.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      message.error("Có lỗi khi đăng xuất");
    }
  };

  // Create menu items based on authentication status
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

  const menuItems = [
    {
      icon: <HomeOutlined />,
      text: "TRANG CHỦ",
      hasSubMenu: false,
    },
    {
      icon: <BookOutlined />,
      text: "TẤT CẢ SẢN PHẨM",
      hasSubMenu: false,
    },
    {
      icon: <BookOutlined />,
      text: "HÈ ĐỌC - HÈ KHÁC BIỆT",
      hasSubMenu: false,
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH MẦM NON",
      hasSubMenu: true,
      subMenu: [
        "Bé Vào Lớp 1",
        "Từ Điển Tranh",
        "Thủ Công - Tập Tô",
        "Phát Triển Trí Tuệ",
      ],
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH THIẾU NHI",
      hasSubMenu: true,
      subMenu: [
        "Truyện Cổ Tích",
        "Sách Học Tập",
        "Sách Kỹ Năng Sống",
        "Sách Khám Phá",
      ],
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH KĨ NĂNG",
      hasSubMenu: true,
      subMenu: [
        "Kỹ Năng Giao Tiếp",
        "Kỹ Năng Lãnh Đạo",
        "Kỹ Năng Quản Lý",
        "Kỹ Năng Mềm",
      ],
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH KINH DOANH",
      hasSubMenu: true,
      subMenu: ["Marketing", "Quản Trị", "Tài Chính", "Khởi Nghiệp"],
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH MẸ VÀ BÉ",
      hasSubMenu: true,
      subMenu: ["Chăm Sóc Trẻ", "Dinh Dưỡng", "Giáo Dục Sớm", "Sức Khỏe"],
    },
    {
      icon: <BookOutlined />,
      text: "SÁCH VĂN HỌC",
      hasSubMenu: true,
      subMenu: ["Tiểu Thuyết", "Truyện Ngắn", "Thơ Ca", "Tác Phẩm Kinh Điển"],
    },
    {
      icon: <ReadOutlined />,
      text: "SÁCH THAM KHẢO",
      hasSubMenu: true,
      subMenu: ["Toán Học", "Văn Học", "Lịch Sử", "Địa Lý"],
    },
    {
      icon: <GiftOutlined />,
      text: "ĐỒ CHƠI TRẺ EM - VPP",
      hasSubMenu: true,
      subMenu: ["Đồ Chơi Giáo Dục", "Bút Viết", "Sách Vở", "Dụng Cụ Học Tập"],
    },

    {
      icon: <TrophyOutlined />,
      text: "TOP BEST SELLER",
      hasSubMenu: false,
    },
    {
      icon: <BellOutlined />,
      text: "TIN TỨC/BLOG",
      hasSubMenu: true,
      subMenu: [
        "Blog - Sách mới",
        "Blog - Sách bán chạy",
        "Blog - Sách kĩ năng sống",
        "Blog - Sách thiếu nhi",
        "Blog - Sách kinh doanh",
        "Blog - Sách văn học",
      ],
    },
    {
      icon: <ExclamationCircleOutlined />,
      text: "SÁCH MỚI",
      hasSubMenu: false,
    },
    {
      icon: <ExclamationCircleOutlined />,
      text: "SÁCH SẮP PHÁT HÀNH",
      hasSubMenu: false,
    },
  ];

  // Create Ant Design menu items
  const createMenuItems = () => {
    return menuItems.map((item, index) => {
      if (item.hasSubMenu) {
        return {
          key: index,
          icon: item.icon,
          label: (
            <div
              onClick={(e) => {
                e.stopPropagation(); // Ngăn event bubble
                // Handle parent category click
                let parentCategory = "";
                if (item.text === "SÁCH MẦM NON") {
                  parentCategory = "children";
                } else if (item.text === "SÁCH THIẾU NHI") {
                  parentCategory = "thieu-nhi";
                } else if (item.text === "SÁCH KĨ NĂNG") {
                  parentCategory = "lifeSkills";
                } else if (item.text === "SÁCH KINH DOANH") {
                  parentCategory = "business";
                } else if (item.text === "SÁCH MẸ VÀ BÉ") {
                  parentCategory = "parenting";
                } else if (item.text === "SÁCH VĂN HỌC") {
                  parentCategory = "literature";
                } else if (item.text === "SÁCH THAM KHẢO") {
                  parentCategory = "reference";
                } else if (item.text === "ĐỒ CHƠI TRẺ EM - VPP") {
                  parentCategory = "toys";
                } else if (item.text === "TIN TỨC/BLOG") {
                  navigate("/category/blog-tat-ca");
                  return;
                }

                if (parentCategory) {
                  navigate(`/allProduct?category=${parentCategory}`);
                }
              }}
              style={{ cursor: "pointer", width: "100%" }}
            >
              {item.text}
            </div>
          ),
          children: item.subMenu.map((subItem, subIndex) => ({
            key: `${index}-${subIndex}`,
            label: subItem,
            onClick: () => {
              let subCategory = "";
              if (subItem === "Bé Vào Lớp 1") {
                subCategory = "be-vao-lop-1";
              } else if (subItem === "Từ Điển Tranh") {
                subCategory = "tu-dien-tranh";
              } else if (subItem === "Thủ Công - Tập Tô") {
                subCategory = "thu-cong-tap-to";
              } else if (subItem === "Phát Triển Trí Tuệ") {
                subCategory = "phat-trien-tri-tue";
              } else if (subItem === "Truyện Cổ Tích") {
                subCategory = "truyen-co-tich";
              } else if (subItem === "Sách Học Tập") {
                subCategory = "sach-hoc-tap";
              } else if (subItem === "Sách Kỹ Năng Sống") {
                subCategory = "sach-ky-nang-song";
              } else if (subItem === "Sách Khám Phá") {
                subCategory = "sach-kham-pha";
              } else if (subItem === "Kỹ Năng Giao Tiếp") {
                subCategory = "ky-nang-giao-tiep";
              } else if (subItem === "Kỹ Năng Lãnh Đạo") {
                subCategory = "ky-nang-lanh-dao";
              } else if (subItem === "Kỹ Năng Quản Lý") {
                subCategory = "ky-nang-quan-ly";
              } else if (subItem === "Kỹ Năng Mềm") {
                subCategory = "ky-nang-mem";
              } else if (subItem === "Khởi Nghiệp") {
                subCategory = "khoi-nghiep";
              } else if (subItem === "Marketing") {
                subCategory = "marketing";
              } else if (subItem === "Quản Trị") {
                subCategory = "quan-tri";
              } else if (subItem === "Tài Chính") {
                subCategory = "tai-chinh";
              } else if (subItem === "Chăm Sóc Trẻ") {
                subCategory = "cham-soc-tre";
              } else if (subItem === "Dinh Dưỡng") {
                subCategory = "dinh-duong";
              } else if (subItem === "Giáo Dục Sớm") {
                subCategory = "giao-duc-som";
              } else if (subItem === "Sức Khỏe") {
                subCategory = "suc-khoe";
              } else if (subItem === "Tiểu Thuyết") {
                subCategory = "tieu-thuyet";
              } else if (subItem === "Truyện Ngắn") {
                subCategory = "truyen-ngan";
              } else if (subItem === "Thơ Ca") {
                subCategory = "tho-ca";
              } else if (subItem === "Tác Phẩm Kinh Điển") {
                subCategory = "tac-pham-kinh-dien";
              } else if (subItem === "Toán Học") {
                subCategory = "toan-hoc";
              } else if (subItem === "Văn Học") {
                subCategory = "van-hoc";
              } else if (subItem === "Lịch Sử") {
                subCategory = "lich-su";
              } else if (subItem === "Địa Lý") {
                subCategory = "dia-ly";
              } else if (subItem === "Đồ Chơi Giáo Dục") {
                subCategory = "do-choi-giao-duc";
              } else if (subItem === "Bút Viết") {
                subCategory = "but-viet";
              } else if (subItem === "Sách Vở") {
                subCategory = "sach-vo";
              } else if (subItem === "Dụng Cụ Học Tập") {
                subCategory = "dung-cu-hoc-tap";
              } else if (subItem === "Blog - Sách mới") {
                navigate("/category/sach-moi");
                return;
              } else if (subItem === "Blog - Sách bán chạy") {
                navigate("/category/sach-ban-chay");
                return;
              } else if (subItem === "Blog - Sách kĩ năng sống") {
                navigate("/category/sach-ki-nang-song");
                return;
              } else if (subItem === "Blog - Sách thiếu nhi") {
                navigate("/category/sach-thieu-nhi");
                return;
              } else if (subItem === "Blog - Sách kinh doanh") {
                navigate("/category/sach-kinh-doanh");
                return;
              } else if (subItem === "Blog - Sách văn học") {
                navigate("/category/sach-van-hoc");
                return;
              }

              if (subCategory) {
                navigate(`/allProduct?category=${subCategory}`);
              }
            },
          })),
        };
      } else {
        // Add onClick handler for menu items without submenu
        let onClickHandler = undefined;
        if (item.text === "TRANG CHỦ") {
          onClickHandler = () => {
            // Clear cart notes when going to home page
            const currentCart = localStorage.getItem("shoppingCart");
            if (currentCart) {
              try {
                const parsedCart = JSON.parse(currentCart);
                // Keep only items, remove notes
                localStorage.setItem(
                  "shoppingCart",
                  JSON.stringify({
                    items: parsedCart.items || [],
                  })
                );
              } catch (error) {
                console.error("Error clearing cart notes:", error);
              }
            }
            navigate("/");
          };
        } else if (item.text === "TẤT CẢ SẢN PHẨM") {
          onClickHandler = () => navigate("/allProduct");
        } else if (item.text === "HÈ ĐỌC - HÈ KHÁC BIỆT") {
          onClickHandler = () => navigate("/allProduct?category=summer");
        } else if (item.text === "TOP BEST SELLER") {
          onClickHandler = () => navigate("/allProduct?sortBy=bestselling");
        } else if (item.text === "SÁCH MỚI") {
          onClickHandler = () => navigate("/allProduct?sortBy=new");
        } else if (item.text === "SÁCH SẮP PHÁT HÀNH") {
          onClickHandler = () => navigate("/allProduct?category=upcoming");
        } else if (item.text === "ĐỒ CHƠI TRẺ EM - VPP") {
          parentCategory = "toys";
        }

        return {
          key: index,
          icon: item.icon,
          label: item.text,
          onClick: onClickHandler,
        };
      }
    });
  };

  // Search function
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search input after search
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Top Bar - Dark Purple */}
      <div className="top-bar">
        <div className="container">{/* Top bar content if needed */}</div>
      </div>

      {/* Main Header - White */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div
              className="logo"
              onClick={() => {
                // Clear cart notes when going to home page
                const currentCart = localStorage.getItem("shoppingCart");
                if (currentCart) {
                  try {
                    const parsedCart = JSON.parse(currentCart);
                    // Keep only items, remove notes
                    localStorage.setItem(
                      "shoppingCart",
                      JSON.stringify({
                        items: parsedCart.items || [],
                      })
                    );
                  } catch (error) {
                    console.error("Error clearing cart notes:", error);
                  }
                }
                navigate("/");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="logo-icon">📚</div>
              <div className="logo-text">
                <div className="logo-title">HIEUVINHbook</div>
                <div className="logo-subtitle">Ươm mầm tri thức</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
              <div className="search-container">
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
            </div>

            {/* User Icons */}
            <div className="user-icons">
              <div
                className="icon-item"
                // onClick={() => navigate("/notifications")}
                style={{ cursor: "pointer" }}
              >
                <BellOutlined className="icon" />
                <span>Thông báo</span>
              </div>
              <div
                className="icon-item"
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer" }}
              >
                <Badge count={cartItemCount} className="cart-badge">
                  <ShoppingCartOutlined className="icon" />
                </Badge>
                <span>Giỏ hàng</span>
              </div>
              <div className="icon-item">
                <Dropdown
                  menu={{ items: createUserMenuItems() }}
                  trigger={["click"]}
                  placement="bottomRight"
                  overlayStyle={{ zIndex: 1000 }}
                >
                  <div className="icon-item">
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
        </div>
      </header>

      {/* Navigation Bar - Light Gray */}
      <div className="navigation-bar">
        <div className="container">
          <div className="nav-content">
            {/* Menu with Dropdown */}
            <div className="menu-section">
              <Dropdown
                menu={{ items: createMenuItems() }}
                trigger={["hover"]}
                placement="bottomLeft"
                overlayStyle={{ zIndex: 1000 }}
              >
                <div className="menu-trigger">
                  <MenuOutlined className="menu-icon" />
                  <span>DANH MỤC SẢN PHẨM</span>
                </div>
              </Dropdown>
            </div>

            {/* Info Links */}
            <div className="info-links">
              <Dropdown
                trigger={["hover"]}
                placement="bottom"
                dropdownRender={() => {
                  let items = [];
                  try {
                    const raw = localStorage.getItem("recentlyViewed");
                    items = raw ? JSON.parse(raw) : [];
                  } catch (error) {
                    console.error("Error loading recently viewed:", error);
                  }
                  return (
                    <div className="recent-dropdown">
                      <div className="recent-actions-top">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => navigate("/recently-viewed")}
                        >
                          Xem tất cả
                        </Button>
                        {items && items.length > 0 && (
                          <Popconfirm
                            title="Xóa tất cả sản phẩm đã xem?"
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                            placement="bottomRight"
                            onConfirm={() => {
                              localStorage.removeItem("recentlyViewed");
                              // Force re-render by updating state
                              // Emit custom event to notify other components
                              window.dispatchEvent(
                                new Event("localStorageCleared")
                              );
                            }}
                          >
                            <Button size="small" type="link" danger>
                              Xóa tất cả
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                      <div className="recent-grid">
                        {(!items || items.length === 0) && (
                          <div className="recent-empty">
                            Chưa có sản phẩm đã xem
                          </div>
                        )}
                        {items &&
                          items.slice(0, 5).map((p) => (
                            <div
                              key={p.id}
                              className="recent-card"
                              onClick={() => navigate(`/product/${p.id}`)}
                            >
                              <div className="recent-image">
                                <img src={p.image} alt={p.title} />
                              </div>
                              <div className="recent-title">{p.title}</div>
                              <div className="recent-price">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(p.price)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                }}
              >
                <span className="info-link" style={{ cursor: "pointer" }}>
                  Sản phẩm đã xem
                </span>
              </Dropdown>
              <div className="info-item">
                <CarOutlined className="info-icon" />
                <span>Ship COD Trên Toàn Quốc</span>
              </div>
              <div className="info-item">
                <CarOutlined className="info-icon" />
                <span>Free Ship</span>
              </div>
            </div>

            {/* Contact */}
            <div className="contact-info">
              <PhoneOutlined className="contact-icon" />
              <span>0966160925 / 0989 849 396</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
