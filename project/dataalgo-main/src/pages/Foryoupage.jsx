import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/foryoupage.css";
import axios from 'axios';
import { useEffect } from 'react';

const Foryoupage = () => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const previousSearches = [
    "Python",
    "Machine Learning",
    "Data Science",
    "Cloud Computing",
    "AI Basics",
  ];

  const handleCreateSearch = () => {
    setSearchBarVisible(true);
  };

  const handleCloseSearch = () => {
    setSearchBarVisible(false);
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/posts/")
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  

  return (
    <>
      <header className="header">
        <div className="logo">EduHub</div>
        <nav className="nav">
          <Link to="/user_profile">
            <img
              src="profile_picture.jpg"
              alt="Your Profile"
              className="small-profile-pic"
            />
          </Link>
          <Link to="/settings" className="btn">
            Post
          </Link>
          <Link to="/settings" className="btn">
            Settings
          </Link>
          <Link to="/chat" className="btn">
            Chat
          </Link>
          <Link to="/logout" className="btn logout">
            Logout
          </Link>
        </nav>
      </header>

      <main className="content">
        <section className="search-section">
          <div className="search-container">
            <button
              id="createSearchBtn"
              className="btn"
              onClick={handleCreateSearch}
            >
              Add Search Bar
            </button>
            <button id="closeBtn" className="btn" onClick={handleCloseSearch}>
              Close
            </button>
          </div>
          <div id="dynamicSearchContainer">
            {searchBarVisible && (
              <>
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search topics, tags, or users..."
                />
                <select className="dropdown">
                  <option value="">Previous Searches</option>
                  {previousSearches.map((search) => (
                    <option key={search} value={search}>
                      {search}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </section>

        <section className="post-feed">
        {posts.length === 0 ? (
              <p>No posts to display.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <Link to="/user_profile" className="profile-link">
                    <img
                      src={`http://localhost:8000/media/avatar/${post.userId}.jpg`} // customize later
                      alt={`${post.username}'s profile`}
                      className="post-profile-pic"
                    />
                    <span className="post-username">{post.username}</span>
                  </Link>
                  <span className="post-time">Recently</span> {/* Optional: use created_at later */}
                </div>
                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-snippet">{post.description}</p>
                  <Link to="/post_details" className="btn">
                    Read More
                  </Link>
                  <div className="post-actions">
                    <button className="btn upvote">Upvote</button>
                    <button className="btn downvote">Downvote</button>
                  </div>
                </div>
              </div>
            ))
          )
          }

        </section>
      </main>

      <footer className="footer">
        <p>EduHub &copy; 2024. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Foryoupage;
