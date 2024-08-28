import React, { useState } from "react";
import "./App.css";
import Header from "./views/shared/Header";
import Footer from "./views/shared/Footer";
import Home from "./views/Home";
import Team from "./views/Team";
import Projects from "./views/Projects";
import Calendar from "./views/Calendar";

function App() {
  const [currentView, setCurrentView] = useState("Home");

  const renderView = () => {
    switch (currentView) {
      case "Home":
        return <Home />;
      case "Team":
        return <Team />;
      case "Projects":
        return <Projects />;
      case "Calendar":
        return <Calendar />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header setCurrentView={setCurrentView} currentView={currentView} />
      <main className="flex-grow no-scrollbar">{renderView()}</main>
      <Footer />
    </>
  );
}

export default App;
