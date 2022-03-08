import Link from 'next/link';
import { useContext } from 'react';
import AuthCheck from '../components/AuthCheck';
import { UserContext } from '../lib/context';

export default function Custom404() {
  const { user, username } = useContext(UserContext);
  return username ? (
    <main>
      <h1>404 - That page does not seem to exist...</h1>
      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  ) : (
    <main>
      <AuthCheck />
    </main>
  );
}
