import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, differenceInYears } from 'date-fns';
import axios from 'axios';
import UpArrow from "../assets/images/arrow-big-up.svg";
import DownArrow from "../assets/images/arrow-big-down.svg";

import PostModel from "../assets/styles/PostModel.module.css";
import HomeStyle from "../assets/styles/home.module.css";

import { GetCookie } from '../components/auth/cookies.jsx';
import AlertComponent from '../components/Alert/AlertComponent.jsx';
import { showAlert } from '../components/Alert/ShowAlert.js';
import Modal from '../components/Modal/Modal.jsx';

const Home = () => {
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();

  const handleUpvote = async (postId) => {
    const userData = GetCookie('data');
    if (!userData) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');

    try {
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/upvote/`, {
        userId: userData.id
      });
      if (response.status === 200) {
        const updatedPost = response.data;
        setPosts(prev => prev.map(post => post.id === postId ? updatedPost : post));
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleDownvote = async (postId) => {
    const userData = GetCookie('data');
    if (!userData) return showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');

    try {
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/downvote/`, {
        userId: userData.id
      });
      if (response.status === 200) {
        const updatedPost = response.data;
        setPosts(prev => prev.map(post => post.id === postId ? updatedPost : post));
      }
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  };

  const handlePurchase = async (PostID, PostPrice, AuthorName) => {
    const userData = GetCookie('data');
    if (!userData) {
      showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/posts/purchase/${PostID}/${AuthorName}/${userData.username}/`,
        { userId: userData.id }
      );
  
      if (response.status === 200) {
        showAlert(setAlert, setAlertVisible, 'success', 'Purchase successful!');
        const updatedPost = response.data;
        setPosts(prev => prev.map(p => p.id === PostID ? updatedPost : p));
        closeModal();
      } else if (response.status === 402) {
        showAlert(setAlert, setAlertVisible, 'error', 'Insufficient balance!');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      showAlert(setAlert, setAlertVisible, 'error', 'Something went wrong');
    }
  };
  

  useEffect(() => {
    axios.get('http://localhost:8000/api/posts/')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));

    const userData = GetCookie('data');
    if (userData) {
      setLoggedIn(true); 
      setUserId(userData.id);
    } else {
      setLoggedIn(false);
    }

  }, []);

  const openModal = (PostPrice, ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags, ModalTitle, ModalContent) => {
    const userData = GetCookie('data');
    if (!userData) {
      showAlert(setAlert, setAlertVisible, 'error', 'Please login first!');
      return;
    }
    setModalContent({ PostPrice, ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags, ModalTitle, ModalContent });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
  
  const PremiumContent = (PostPrice, ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags) => {
    openModal(PostPrice, ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags, 'Purchase', `Are you sure you want to purchase this content for $${PostPrice}?`);
  };
  
  const SubscribeContent = (ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags) => {
    openModal(0, ContentType, AuthorId, AuthorName, PostId, PostTitle, PostTags, 'Subscription', `Are you sure you want to subscribe to ${AuthorName}?`);
  };
  

  const getClassName = (contentType) => {
    switch (contentType) {
      case 1: return PostModel.PostSubscription;
      case 2: return PostModel.PostPremium;
      default: return '';
    }
  };

  return (
    <>
      <AlertComponent alert={alert} setAlert={setAlert} alertVisible={alertVisible} />
  
      <main className={HomeStyle.HomeContent}>
        {LoggedIn && (
          <section className={HomeStyle.Hero}>
            <h1>Welcome to EduHub!</h1>
            <p>Your go-to platform for sharing and discovering educational resources.</p>
          </section>
        )}
  
        <section className={PostModel.Posts}>
          {posts.length === 0 ? (
            <div className={PostModel.Post}>
              <p>No posts available</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className={`${PostModel.Post} ${getClassName(post.contentType)}`}>
                <div className={PostModel.PostHeader}>
                  <h2 className={PostModel.PostTitle}>{post.title || 'Untitled'}</h2>
                  <span className={PostModel.PostTimestamp}>
                    {post.created_at ? (
                      differenceInYears(new Date(), new Date(post.created_at)) >= 1
                        ? format(new Date(post.created_at), 'MMMM d, yyyy')
                        : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                    ) : 'Unknown date'}
                  </span>
                </div>
  
                <p className={PostModel.PostTags}>Tags: {post.tags || 'None'}</p>
  
                <p className={PostModel.PostAuthor}>
                  Posted by
                  <img
                    src={`http://localhost:8000/api/accounts/avatar/${post.userId ?? 0}/`}
                    className={PostModel.PostAuthorIcon}
                    alt="User"
                  />
                  <Link to={`/profile/${post.username ?? ''}`} className={PostModel.PostAuthorName}>
                    <span>{post.username ?? 'Unknown'}</span>
                  </Link>
                </p>
  
                {/* Content Lock Logic */}
                {post.contentType === 1 && !post.isSubscribed ? (
                  <div className={PostModel.LockedContainer}>
                    <p>This content is locked. Please subscribe to access.</p>
                    <button
                      className={PostModel.PostActionsButton}
                      onClick={() =>
                        SubscribeContent(
                          post.contentType,
                          post.userId,
                          post.username,
                          post.id,
                          post.title,
                          post.tags
                        )
                      }
                    >
                      Subscribe
                    </button>
                  </div>
                ) : post.contentType === 2 && !post.purchase?.includes(userId) && post.userId !== userId ? (
                  <div className={PostModel.LockedContainer}>
                    <p>This content is locked. Please purchase to access.</p>
                    <p className={PostModel.PostPrice}>${post.price?.toFixed(2)}</p>
                    <button
                      className={PostModel.PostActionsButton}
                      onClick={() =>
                        PremiumContent(
                          post.price?.toFixed(2),
                          post.contentType,
                          post.userId,
                          post.username,
                          post.id,
                          post.title,
                          post.tags
                        )
                      }
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div className={PostModel.PostDescription}>
                    <p>{post.description}</p>
                  </div>
                )}
  
                {/* Voting Actions */}
                <div className={PostModel.PostActions}>
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`${PostModel.PostActionsButton} ${PostModel.ButtonVote} ${post.upvotes?.includes(userId) ? PostModel.ButtonVoted : ''}`}
                  >
                    <img src={UpArrow} alt="Upvote" />
                  </button>
                  <p>{(post.upvotes?.length ?? 0) - (post.downvotes?.length ?? 0)}</p>
                  <button
                    onClick={() => handleDownvote(post.id)}
                    className={`${PostModel.PostActionsButton} ${PostModel.ButtonVote} ${post.downvotes?.includes(userId) ? PostModel.ButtonVoted : ''}`}
                  >
                    <img src={DownArrow} alt="Downvote" />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
  
      {/* Modal for Subscription & Purchase */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <h2>{modalContent?.ModalTitle}</h2>
        <div className={HomeStyle.ModdalPostContainer}>
          <p>{modalContent?.ModalContent}</p>
          <div className={PostModel.Post}>
            <p className={HomeStyle.ModalTitle}>{modalContent?.PostTitle}</p>
            <div className={HomeStyle.ModalAuthor}>
              <p className={HomeStyle.ModalTitle}>
                Posted by:
                <img
                  src={`http://localhost:8000/api/accounts/avatar/${modalContent?.AuthorId}`}
                  style={{
                    margin: '0 0.25rem',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  alt="User"
                />
                <span className={HomeStyle.Bold}>{modalContent?.AuthorName}</span>
              </p>
            </div>
          </div>
        </div>
  
        {modalContent?.ContentType === 1 && (
          <div className={PostModel.PostActions}>
            <button className={HomeStyle.ModalButton} onClick={() => navigate(`/profile/${modalContent?.AuthorName}`)}>Yes</button>
            <button className={HomeStyle.ModalButton} onClick={closeModal}>No</button>
          </div>
        )}
  
        {modalContent?.ContentType === 2 && (
          <div className={PostModel.PostActions}>
            <button
              className={HomeStyle.ModalButton}
              onClick={() =>
                handlePurchase(modalContent?.PostId, modalContent?.PostPrice, modalContent?.AuthorName)
              }
            >
              Purchase
            </button>
            <button className={HomeStyle.ModalButton} onClick={closeModal}>
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </>
  );
  
}

export default Home;