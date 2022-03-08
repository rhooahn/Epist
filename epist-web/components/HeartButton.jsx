import{firestore_db,auth,increment,collection,doc} from '../lib/firebase'
import { useDocument } from 'react-firebase-hooks/firestore'
import { writeBatch } from 'firebase/firestore';

//Allow user to heart or like a post
export default function Heart({postRef
}){
    //listen to heart document for currently logged in user
    const heartRef = doc(postRef,'hearts',auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef)
    console.log(heartDoc?.exists())

    //handlers
    const addHeart = async() => {
        const uid = auth.currentUser.uid
        const batch = writeBatch(firestore_db)
        batch.update(postRef, {heartCount:increment(1)})
        batch.set(heartRef,{
            uid: uid,
        })

        await batch.commit()
    }
    
    const removeHeart = async() => {
        const uid = auth.currentUser.uid
        const batch = writeBatch(firestore_db)
        batch.update(postRef, {heartCount:increment(-1)})
        batch.delete(heartRef)

        await batch.commit()
    }


    console.log(heartDoc?.exists())

    return heartDoc?.exists() ? (
        <button onClick = {removeHeart}>💔 Unheart</button>
    ):(
        <button onClick = {addHeart}>💗 Heart</button>
    )
}
