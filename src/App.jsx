import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "@/components/pages/Dashboard";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </motion.div>
    </div>
  );
}

export default App;