import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import { UserContext } from '../lib/context';
import {
  collectionGroup,
  getDocs,
  query,
  startAfter,
} from 'firebase/firestore';
import {
  firestore_db,
  where,
  limit,
  query as fsQuery,
  orderBy,
  collection,
  postToJSON,
  fromMillis,
} from '../lib/firebase';
import PostFeed from '../components/PostFeed';

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(firestore_db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  const posts = await (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: { posts },
  };
}

export default function Home(props) {
  const { user, username } = useContext(UserContext);
  const [posts, setPosts] = useState(props.posts); //server render as initial values
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = fsQuery(
      collectionGroup(firestore_db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = await (await getDocs(query)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  //href points to route to navigate to
  //children inside Link component direct to the page
  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}

{
  /* <div>
<Link
  prefetch={true}
  href={{
    pathname: '/[username]',
    query: { username: username },
  }}
>
  <a>Richard's profile</a>
</Link>
<Loader show />
<button onClick={() => toast.success('Hellotoast')}>Toast Me</button>
</div> */
}
