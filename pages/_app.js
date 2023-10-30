import '@/styles/globals.css'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth,db} from '../firebase'; 
import Login from './login';
import Loading from '@/components/Loading';
import { useEffect } from 'react';
import { doc,serverTimestamp, setDoc } from 'firebase/firestore';


export default function App({ Component, pageProps }) {

  const [user,loading] = useAuthState(auth)

  useEffect(() =>{
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
  
      setDoc(userDocRef, {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL,
      },{merge:true})
        .then(() => {
          console.log('Document successfully written!');
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    }
  },[user]);

  if(loading) return <Loading/>
  if(!user) return <Login/>;
  
  return <Component {...pageProps} />

}
