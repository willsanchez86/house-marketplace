import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();

  const googleAuth = async () => {
    try {
      // Instantiate Google Auth Provider
      const provider = new GoogleAuthProvider();

      // OPTIONAL: Add Scope to provider
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      const auth = getAuth();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (user) {
        navigate('/');
      }

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, then create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  };
  return (
    <div className="socialIconDiv">
      <img
        src={googleIcon}
        alt="Google Authentication"
        className="socialIconImg"
        onClick={googleAuth}
      />
    </div>
  );
}

export default OAuth;
