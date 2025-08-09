import { useState } from "react";
import { Button, Typography, Space } from "antd";
import Header from "./components/Header";
import "./App.css";

const { Title } = Typography;

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        {/* Content will be added here later */}
      </div>
    </div>
  );
}

export default App;
