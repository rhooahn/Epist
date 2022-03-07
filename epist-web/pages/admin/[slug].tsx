import { useRouter } from 'next/router';

export default function AdminPostEdit({}) {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <main>
      <h1>{slug}</h1>
    </main>
  );
}
