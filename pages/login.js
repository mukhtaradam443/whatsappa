import { auth, provider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import Head from "next/head";
import styled from "styled-components"


function Login() {
  const signIn = () =>{
    signInWithPopup(auth, provider)
    .then((result) => {
      // Handle the sign-in result here
    })
    .catch((error) => {
      // Handle sign-in errors here
    });
  }
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src="https://i.ibb.co/Z8bzGGh/whatsapp.jpg"/>
        <button onClick={signIn} variant='outlined'>Sign in with Google</button>
      </LoginContainer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  display:grid;
  place-items:center;
  height:100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding:100px;
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0,0,0, 0.7);
`;

const Logo = styled.img`
  height:200px;
  width:200px;
  margin-bottom:50px; 
`;
      