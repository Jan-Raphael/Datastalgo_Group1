import { BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
//Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Foryoupage from "./pages/Foryoupage";
import Post from "./pages/Post";
import Profile from "./pages/Profile";

const Routed = () => {
  return (
    <Routes>
      <Route path="/" element={<><Header /><Home /><Footer/></>} />
      <Route path="/login" element={<><Login /></>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/foryoupage" element={<Foryoupage />} />
      <Route path="/post" element={<Post />} />
      <Route path="/profile/:username" element={<><Header /><Profile /><Footer/></>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Routed />
    </Router>
  );
};


export default App;