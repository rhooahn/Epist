import { UserContext } from '../lib/context';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  auth,
  collection,
  doc,
  firestore_db,
  onSnapshot,
} from '../lib/firebase';

export function useUserData() {
  const [user] = useAuthState(auth); //returns firebase auth.User or null
  const [username, setUsername] = useState(null);

  //attempt to minimize state change transition, doesn't work perfect
  if (user && username === null) {
    const ref = doc(firestore_db, 'users', user.uid); //reference user profile in db
    let unsubscribe = onSnapshot(ref, (doc) => {
      //update anytime user profile data change
      setUsername(doc.data()?.username); //update username if uid exists
    });
  }

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe; //initialize
    console.log('UEF user:' + user?.uid + 'username:' + username);

    if (user) {
      //if not null
      const ref = doc(firestore_db, 'users', user.uid); //reference user profile in db
      unsubscribe = onSnapshot(ref, (doc) => {
        //update anytime user profile data change
        setUsername(doc.data()?.username); //update username if uid exists
      });
    } else {
      setUsername(null); //move to username form
    }

    return unsubscribe; //onSnapshot returns a function than when called closes the connection with the db server file
  }, [user]); //only run effect is [user] changes

  return { user, username };
}
