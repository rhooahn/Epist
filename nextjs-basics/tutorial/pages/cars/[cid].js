import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Error from 'next/error'

export default function Car({ activecar }) {

    const router = useRouter()
    const { cid } = router.query
    return (<>
            <Head>
                <title>{activecar.color} {activecar.id}</title>
            </Head>

            <h1 className={styles.title}>
                {cid}
            </h1>

            <img src={activecar.image} width="300px" />
            </>
    )
}


export async function getServerSideProps({ params }) {

    const res = await fetch(`http://localhost:3000/${params.cid}.json`)
    if (!res.ok){
        return {notFound:true}
    }
    
    const data = await res.json()
  
    return {
      props: { activecar: data }, // will be passed to the page component as props
    }
    
}

// export async function getStaticProps({ params }) {

//     const req = await fetch(`http://localhost:3000/${params.cid}.json`);
//     const data = await req.json();

//     return {
//         props: { activecar: data },
//     }
// }

// export async function getStaticPaths() {

//     const req = await fetch('http://localhost:3000/cars.json');
//     const data = await req.json();

//     const paths = data.map(activecar => {
//         return { params: { cid: activecar } }
//     })

//     return {
//         paths,
//         fallback: false
//     };
// }
