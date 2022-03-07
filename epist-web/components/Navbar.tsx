import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

//top navbar
export default function Navbar({}) {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {/* User is signed in and has username */}
        {username && (
          <>
            <li>
              <Link href="/admin">
                <button>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}
        {/* User is not signed in OR no username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
