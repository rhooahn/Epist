import { UserContext } from '../lib/context';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  auth,
  collection,
  doc,
  firestore_db,
  onSnapshot,
} from '../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function useUserData() {
  //const [user] = useAuthState(auth); //returns firebase auth.User or null
  //console.log('userUserData ran:' + user?.uid);
  //Login state based on user + username
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // turn off realtime subscription
  //   let unsubscribe; //initialize
  //   console.log('UEF user:' + user?.uid + 'username:' + username);

  //   if (user) {
  //     //if not null
  //     const ref = doc(firestore_db, 'users', user.uid); //reference user profile in db
  //     unsubscribe = onSnapshot(ref, (doc) => {
  //       //update anytime user profile data change
  //       setUsername(doc.data()?.username); //update username if uid exists
  //     });
  //   } else {
  //     setUsername(null); //move to username form
  //   }

  //   return unsubscribe; //onSnapshot returns a function than when called closes the connection with the db server file
  // }, [user]); //only run effect is [user] changes

  onAuthStateChanged(auth, (user) => {
    let unsubscribe;
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      const ref = doc(firestore_db, 'users', user.uid); //reference user profile in db
      unsubscribe = onSnapshot(ref, (doc) => {
        //update anytime user profile data change
        setUser(user);
        setUsername(doc.data()?.username); //update username if uid exists
      });
    } else {
      // User is signed out
      setUser(null);
      setUsername(null); //move to username form
    }
  });

  return { user, username };
}
