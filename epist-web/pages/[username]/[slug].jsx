import styles from '../../styles/Post.module.css';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import {
  getUserWithUsername,
  collection,
  getDoc,
  doc,
  firestore_db,
  postToJSON,
} from '../../lib/firebase';
import AuthCheck from '../../components/AuthCheck';
import Link from 'next/link';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    // console.log(slug);
    const postRef = doc(collection(userDoc.ref, 'posts'), slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  console.log(post, path);
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await getDocs(collectionGroup(firestore_db, 'posts'));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(firestore_db, props.path);
  const [realtimePost] = useDocumentData(postRef); //create socket with doc ref

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button> 💗 Sign Up </button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
