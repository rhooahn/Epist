import { useRouter } from 'next/router';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import {
  getUserWithUsername,
  collection,
  where,
  query as fsQuery,
  limit,
  orderBy,
  getDocs,
  postToJSON,
} from '../../lib/firebase';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = fsQuery(
      collection(userDoc.ref, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    ); //ref of query snapshot
    posts = await (await getDocs(postsQuery)).docs.map(postToJSON);
  }
  return {
    props: { user, posts }, //pass to page components as props
  };
}

export default function UserProfilePage({ user, posts }) {
  const router = useRouter();
  let username = router.query.username;

  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
