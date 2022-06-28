import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  // Form Methods
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value, // Must wrap key in square brackets
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Incorrect User Credentials');
    }
  };

  return (
    <>
      <div className="pageCOntainer">
        <h1 className="pageHeader">Welcome Back!</h1>
        <form onSubmit={onSubmit}>
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
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button type="submit" className="signInButton">
              <KeyboardArrowRightIcon
                fill="#ffffff"
                width="34px"
                height="34px"
              />
            </button>
          </div>
        </form>

        <div className="socialLogin">
          <p>Sign In With</p>
          <OAuth />
          <Link to="/sign-up" className="registerLink">
            Sign Up Instead
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignIn;
