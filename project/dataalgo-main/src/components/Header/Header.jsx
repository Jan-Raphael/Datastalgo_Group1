import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  UserOutlined,
  SettingOutlined,
  DollarOutlined,
  LogoutOutlined
} from '@ant-design/icons';

import HeaderStyle from './header.module.css';
import UserIcon from "../../assets/images/user.svg";
import { GetCookie, RemoveCookie } from '../auth/cookies.jsx';

const Header = () => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userDataServer, setUserDataServer] = useState(null);
  const [avatar, setAvatar] = useState(UserIcon);

  const navigate = useNavigate();
  const userData = GetCookie('data');

  const username = userData?.username;
  const userid = userData?.id;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    RemoveCookie('data');
    navigate('/login');
  };

  // Scroll hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setIsDropdownOpen(false);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Fetch avatar and user balance (Django-compatible)
  useEffect(() => {
    if (userData?.id) {
      axios.get(`http://localhost:8000/api/accounts/avatar/${userData.id}/`)
        .then(res => {
          setAvatar(`http://localhost:8000${res.data.avatar}`);
        })
        .catch(() => setAvatar(UserIcon));
    }

    if (username) {
      fetch(`http://localhost:8000/api/accounts/user/${username}/`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setUserDataServer(data);   
          }
        })
        .catch(err => console.error("User data fetch error:", err));
    }
  }, [username]);

  const menuItems = [
    { label: 'Profile', link: `/profile/${username}`, icon: <UserOutlined /> },
    { label: 'Settings', link: '/settings', icon: <SettingOutlined /> },
    {
      label: `$${userDataServer?.balance ?? 0}`,
      link: '/wallet',
      icon: <DollarOutlined />
    },
    { label: 'Logout', onClick: handleLogout, icon: <LogoutOutlined /> }
  ];

  return (
    <>
      <div className={HeaderStyle.Spacer}></div>
      <header className={`${HeaderStyle.Header} ${isScrollingDown ? HeaderStyle.HeaderHidden : ""}`}>
        <Link to="/" className={HeaderStyle.Logo}>EduHub</Link>

        <label htmlFor="nav-toggle" className={HeaderStyle.NavToggleLabel}>
          <span></span><span></span><span></span>
        </label>
        <input type="checkbox" id="nav-toggle" className={HeaderStyle.NavToggle} />

        <nav className={HeaderStyle.Nav}>
          {!userData ? (
            <Link to="/login" className={HeaderStyle.Btn}>Login</Link>
          ) : (
            <div className={HeaderStyle.AvatarContainer}>
              <div className={HeaderStyle.dropdown}>
                <img
                  src={avatar}
                  alt="User Avatar"
                  className={HeaderStyle.avatar}
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className={HeaderStyle.menu}>
                    {menuItems.map((item, index) => (
                      <div key={index} className={HeaderStyle.menuItem} onClick={item.onClick}>
                        {item.icon}
                        {item.link ? (
                          <Link className={HeaderStyle.menuItemLink} to={item.link}>
                            {item.label}
                          </Link>
                        ) : item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/post" className={HeaderStyle.Btn}>Post</Link>
            </div>

          )}

        </nav>
      </header>
    </>
  );
};

export default Header;
