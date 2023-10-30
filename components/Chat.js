import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { Avatar } from "@mui/material";
import { collection, where } from "firebase/firestore";
import { router } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";



function Chat({id,users}) {
    const [user] = useAuthState(auth);

    // const [recipientEmailSnapshot] = useCollection(collection(db,'users').whare('email', "==", recipientEmailSnapshot(users,user)))
    const [recipientEmailSnapshot] = useCollection(collection(db,'users'),where('email','==',getRecipientEmail(users,user)))

    const recipient = recipientEmailSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(users,user)
    console.log(recipientEmail)
    const enterChat = () =>{
        router.push(`/chat/${id}`)
    }

  return(
    <Container onClick={enterChat}>
        {recipient ? (
            <UserAvatar src={recipient?.photoURL}/>
        ):(

        <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}
        <p>{recipientEmail}</p>
    </Container>
  ) 
};

export default Chat;

const Container = styled.div`
display: flex;
align-items:center;
padding:15px;
word-break:break-word;
cursor: pointer;
width: 100%;
    &:hover {
        background-color: #e9eaeb;
    }
`;

    


const UserAvatar = styled(Avatar)`
animation-fill-mode: inherit;
margin: 5px;
margin-right:15px;
`;
