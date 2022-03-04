import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function Home() {
  //href points to route to navigate to
  //children inside Link component direct to the page
  return (
    <div>
      <Link
        prefetch={true}
        href={{
          pathname: '/[username]',
          query: { username: 'rich123' },
        }}
      >
        <a>Richard's profile</a>
      </Link>
      <Loader show />
      <button onClick={() => toast.success('Hellotoast')}>Toast Me</button>
    </div>
  );
}
