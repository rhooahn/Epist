import { useContext, useState } from 'react';
import { UserContext } from '../lib/context';
import {
  auth,
  auth_provider,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from '../lib/firebase';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);
  const username2 = 'testuser';
  //const user = null;
  //const {user, username} = useContext(UserContext)
  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. User signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <>
            <UsernameForm />
          </>
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}

      <h1>PLACEHOLDER</h1>
    </main>
  );
}

//Sign in with Google O-auth
function SignInButton() {
  const signInWithGoogle = async () => {
    //returns a Promise
    signInWithPopup(auth, auth_provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; //JSON web token stored in browser to access google API
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} /> Sign in with Google
      </button>
    </>
  );
}
//Sign out button
function SignOutButton() {
  return (
    <>
      <button
        onClick={async () =>
          signOut(auth)
            .then(() => {
              // Sign-out successful.
            })
            .catch((error) => {
              // An error happened.
            })
        }
      >
        Sign Out
      </button>
      <h1>Sign out State</h1>
    </>
  );
}
//Tag Firebase uid with custom username
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onChange = (e) => {
    //force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
  };

  return (
    <>
      !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
      )<h1>Usernameform</h1>
    </>
  );
}
