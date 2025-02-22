import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage.js";
import Admindashboard from "./pages/Admindashboard.js";
import Studentdashboard from "./pages/Studentdashboard.js";
function App() {
  return (
    <div className="App">
      <div className="content">
        <Route path="/" component={Homepage} exact />
        <Route path="/admin/dashboard" component={Admindashboard} exact />
        <Route path="/student/dashboard" component={Studentdashboard} exact />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Soumyadeep Singh</span>
          <div className="social-icons">
            <a
              href="https://www.linkedin.com/in/soumyadeep-singh-347044258/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-linkedin"></i>
            </a>
            <a
              href="https://github.com/singhsoumya0109"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="https://singhsoumya0109.github.io/Portfolio-website/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-briefcase"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
