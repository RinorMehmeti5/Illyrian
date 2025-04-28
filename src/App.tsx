// App.tsx
import React from "react";
import AppRoutes from "./AppRoutes/AppRoutes";
import { ThemeProvider } from "./contexts/ThemeContext";
import CustomToastContainer from "./components/ui/CustomToast";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
      <CustomToastContainer />
    </ThemeProvider>
  );
}

export default App;
