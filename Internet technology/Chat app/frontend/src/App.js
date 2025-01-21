import './App.css';
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import Chatpage from "./pages/Chatpage.js";

function App() {
  return (
    <div className="App">
      <div className="content">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
      </div>
       <footer className="footer">
        <div className="container d-flex justify-content-between align-items-center">
          <span>&copy; Soumyadeep Singh</span>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/soumyadeep-singh-347044258/" target="_blank" rel="noreferrer">
              <i className="bi bi-linkedin"></i> 
            </a>
            <a href="https://github.com/singhsoumya0109" target="_blank" className="github-icon" rel="noreferrer">
              <i className="bi bi-github"></i>
            </a>
            <a href="https://singhsoumya0109.github.io/Portfolio-website/" target="_blank" className="portfolio-icon" rel="noreferrer">
              <i className="bi bi-briefcase"></i> 
            </a>
          </div>
        </div>
      </footer> 
    </div>
  );
}

export default App;
