import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <div className="pretty">
          <Link href="/enter">
            <button className="btn-fallback">
              Click here to complete sign in / username registration process
            </button>
          </Link>
        </div>
      );
}
