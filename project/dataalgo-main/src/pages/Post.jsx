import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from 'antd';
import PostStyle from "../assets/styles/post.module.css";
import FormStyle from "../assets/styles/form.module.css";
import { GetCookie } from '../components/auth/cookies.jsx';
import axios from 'axios';

const Post = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [contentType, setContentType] = useState(0);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [price, setPrice] = useState(0.0);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = GetCookie('data');
    if (!userData) {
      navigate('/');
    }
  }, [navigate]);

  const handlePaidChange = () => {
    setIsPaid(!isPaid);
    setShowPriceInput(false);
    setContentType(0);
  };

  const handleSubscriptionClick = () => {
    setShowPriceInput(false);
    setContentType(1);
  };

  const handlePriceBaseClick = () => {
    setShowPriceInput(true);
    setContentType(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = GetCookie('data');
    if (!userData) {
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('description', description);
    formData.append('contentType', contentType);
    formData.append('price', price);

    const attachmentsInput = document.getElementById('attachments');
    for (let i = 0; i < attachmentsInput.files.length; i++) {
      formData.append('attachments', attachmentsInput.files[i]);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/posts/publish/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Successfully published' });
        setTimeout(() => navigate('/'), 1000);
      } else {
        setAlert({ type: 'error', message: 'Post failed. Try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Server error. Please try again later.' });
    }

    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  return (
    <>
      <div className={`${PostStyle.Alert} ${alertVisible ? PostStyle.AlertVisible : PostStyle.AlertHidden}`}>
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type}
            showIcon
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}
      </div>

      <header className="header">
        <div className="logo">EduHub</div>
        <nav className="nav">
          <Link to="/" className="btn">Home</Link>
          <Link to="/profile" className="btn">Profile</Link>
        </nav>
      </header>

      <main className={PostStyle.Wrapper}>
        <section className={FormStyle.PostFormContainer}>
          <h2>Create a new post</h2>
          <form onSubmit={handleSubmit}>
            <div className={FormStyle.FormGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter post title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={FormStyle.FormGroup}>
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="Enter tags separated by commas"
                required
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className={FormStyle.FormGroup}>
              <label htmlFor="attachments">Attachments</label>
              <input type="file" id="attachments" name="attachments" multiple />
            </div>

            <div className={FormStyle.FormGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Write your post description here..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={FormStyle.FormGroup}>
              <div className={FormStyle.CheckBox}>
                <p htmlFor="isPaid">Paid Content</p>
                <input type="checkbox" id="isPaid" name="isPaid" onChange={handlePaidChange} />
              </div>
            </div>

            {isPaid && (
              <div className={FormStyle.SubPriceButton}>
                <button type="button" onClick={handleSubscriptionClick}>Subscription</button>
                <button type="button" onClick={handlePriceBaseClick}>Price base</button>
              </div>
            )}

            {showPriceInput && (
              <div className={FormStyle.FormGroup}>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className={FormStyle.SubmitBtn}>Publish</button>
          </form>
        </section>

        <footer className={PostStyle.Footer}>
          <p><Link to="/">EduHub</Link> &copy; 2024. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
};

export default Post;
