import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailPage from "./pages/DetailPage";
import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AllProductsPage from "./pages/AllProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import "./App.css";
import OrderLookupPage from "./pages/OrderLookupPage";
import CategoryPage from "./pages/CategoryPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogTatCaPage from "./pages/BlogTatCaPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<DetailPage />} />
        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/allProduct" element={<AllProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-lookup" element={<OrderLookupPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/blogs/:category/:slug" element={<BlogPostPage />} />
        <Route path="/category/blog-tat-ca" element={<BlogTatCaPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
