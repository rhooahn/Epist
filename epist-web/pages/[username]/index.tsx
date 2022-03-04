import { useRouter } from 'next/router'

export default function Page({}) {
  const router = useRouter()
  let username = router.query.username

  return (
    <main>
      <h1>Username: {username}</h1>
    </main>
  )
}
