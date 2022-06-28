import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { ReactComponent as GoogleIcon } from '../assets/svg/googleIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value, // Must wrap key in square brackets
    }));
  };

  // SUbmit Form and laod to FireStore
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get auth object
      const auth = getAuth();

      // Register User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get User Info for Database
      const user = userCredential.user;

      // CHange display to current User
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Create a copy of data and manipulate (Don't want to adjust the current Data States)
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      // Redirect to Home
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
    }
  };

  return (
    <>
      <div className="pageCOntainer">
        <h1 className="pageHeader">Welcome Back!</h1>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? 'text' : 'password'}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt="Show Password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button type="submit" className="signUpButton">
                <KeyboardArrowRightIcon
                  fill="#ffffff"
                  width="34px"
                  height="34px"
                />
              </button>
            </div>
            <div className="socialLogin">
              {/* <p>Sign up with</p>
              <div className="socialIconDiv">
                <GoogleIcon />
              </div> */}

              <Link to="/sign-in" className="registerLink">
                Sign In Instead
              </Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default SignUp;
