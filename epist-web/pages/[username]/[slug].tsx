import styles from '../../styles/Post.module.css';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import {
  getUserWithUsername,
  collection,
  getDoc,
  doc,
  firestore_db,
  postToJSON,
} from '../../lib/firebase';

export async function getStaticProps({ params }) {
  //pre-render page in advance at build time
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    console.log(slug);
    const postRef = doc(collection(userDoc.ref, 'posts'), slug);
    console.log(postRef);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
    // console.log(path);
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore_db, 'posts'));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {
    //format:
    // paths: [
    // {params: {username,slug}}
    // ]
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(props.path);
  const [realtimePost] = useDocumentData(postRef); //create socket with doc ref

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section></section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
