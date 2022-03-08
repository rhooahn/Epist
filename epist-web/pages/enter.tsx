import { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';
import Loader from '../components/Loader';

import {
  auth,
  auth_provider,
  signInWithPopup,
  GoogleAuthProvider,
  doc,
  signOut,
  firestore_db,
  getDoc,
  writeBatch,
  onSnapshot,
} from '../lib/firebase';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  console.log('re-rendering Enter, user: ' + user + ' username: ' + username);

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
  const { user, username } = useContext(UserContext);

  const signInWithGoogle = async () => {
    //returns a Promise
    await signInWithPopup(auth, auth_provider)
      .then((user) => {
        console.log('just signed in: ' + user.user.uid);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <button
        className="btn-google"
        onClick={async () => {
          await signInWithGoogle();
        }}
      >
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

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onSubmit = async (e) => {
    e.preventDefault(); //prevent page refresh

    //Create refs to both documents
    const userDoc = doc(firestore_db, 'users', user.uid);
    const usernameDoc = doc(firestore_db, 'usernames', formValue);

    //Commit both docs together as a batch write
    const batch = writeBatch(firestore_db);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    //force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //Hit the databse for username match after each debounced change
  //React will create new instance of this function on each re-render, thus debounce will have multiple execution contexts
  //useCallback solves the above by memoizing the function in memory, maintaining a single execution context
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore_db, 'usernames', username);
        const exists = (await getDoc(ref)).exists(); //await promise, then run method on it
        console.log('Firestore read executed!' + username + ' ' + !exists);
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
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
    )
  );
}
