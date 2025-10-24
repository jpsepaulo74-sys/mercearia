import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "@/react-app/components/Layout";
import HomePage from "@/react-app/pages/Home";
import ProductsPage from "@/react-app/pages/Products";
import SalesPage from "@/react-app/pages/Sales";
import TrashPage from "@/react-app/pages/Trash";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
