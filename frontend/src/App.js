import React from "react";
import { BrowserRouter as Router, Routes,Route,Link } from "react-router-dom";
import Home from "./components/Home";
import Players from "./components/Players";
import Sports from "./components/Sports";

function App(){

  return(
    <Router>
      <div className="App">
        <h1>Sports Website</h1>
        <nav>
          <Link to="/">Home</Link> |
          <Link to="/sportslist">Sports</Link> |
          <Link to="/playerlist">Players</Link> |
        </nav>

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/sportslist" element={<Sports />}/>
          <Route path="/playerlist" element={<Players />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;