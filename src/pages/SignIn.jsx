import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { ReactComponent as GoogleIcon } from '../assets/svg/googleIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value, // Must wrap key in square brackets
    }));
  };

  return (
    <>
      <div className="pageCOntainer">
        <h1 className="pageHeader">Welcome Back!</h1>
        <main>
          <form action="">
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
            <Link to="forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <KeyboardArrowRightIcon
                  fill="#ffffff"
                  width="34px"
                  height="34px"
                />
              </button>
            </div>
            <div className="socialLogin">
              <p>Sign in with</p>
              <div className="socialIconDiv">
                <GoogleIcon />
              </div>

              <Link to="/sign-up" className="registerLink">
                Sign Up Instead
              </Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

export default SignIn;
