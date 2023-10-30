import { auth, db } from "@/firebase";
import { Avatar, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import {InsertEmoticon, Mic, MoreVert} from '@mui/icons-material';
import { AttachFile } from "@mui/icons-material";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import Message from "./Message";
import { useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import {TimeAgo} from  'timeago-react';



function ChatScreen({chat,messages}) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input,setInput] = useState("");
    const endOfMessageRef = useRef(null)

    const chatId = router.query.id;

    const chatDocRef = doc(db, 'chats', chatId); // Create a reference to the chat document
    const messagesRef = collection(chatDocRef, 'messages'); // Reference to the 'messages' subcollection
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    const [messagesSnapshot] = useCollection(messagesQuery);

    const [recipientSnapshot] = useCollection(
        collection(db,'chats'),where('email','==',getRecipientEmail(chat.users,user))
    )


    const showMessages = () =>{
        if(messagesSnapshot){
            return messagesSnapshot.docs.map((message)=>(
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp:message.data().timestamp?.toDate().getTime()
                    }}
                />
            ));
        }else{
            return JSON.parse(messages).map((message) =>(
                <Message key={message.id} user={message.user} message={message}/>
            ))
        }
    };

    const scrollToBottom = () => {
        endOfMessageRef.current.ScrollToBottom({
            behavior:'smooth',
            block:'start',
        })
    }

    const sendMessage = (e) =>{
        e.preventDefault();
        
       const setChat = doc(db,'users',user.uid)
       setDoc(setChat,{lastSeen:serverTimestamp()},{merge:true})
    
       const chatId = router.query.id; // Replace with the actual chat ID
       const chatDocRef = doc(db, 'chats', chatId);
       
       // Access the 'messages' subcollection of the chat document
       const messagesCollection = collection(chatDocRef, 'messages');
       
       // Add a new message to the 'messages' subcollection
       addDoc(messagesCollection, {
         timestamp: serverTimestamp(),
         message: input,
         user: user.email,
         photoURL: user.photoURL,
       })
         .then(() => {
           // Message added successfully
           setInput(''); // Clear the input field
           scrollToBottom()
         })
         .catch((error) => {
           console.error('Error adding message:', error);
         });
    }    
    const recipient = recipientSnapshot?.docs?.[0]?.data();  
    const recipientEmail = getRecipientEmail(chat.users,user);
  return (
    <Container>
      <Header>
        {recipient ? (
            <Avatar src={recipient?.photoURL}/>
        ) : (
            <Avatar>{recipientEmail?.[0]}</Avatar>
        )}

        <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
                <p>Last active: {' '}
                {recipient?.lastSeen?.toDate() ? (
                    <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                ) : (
                    "Unavailable"
                )}
                </p>
            ):(
                <p>Loading last active...</p> 
            )}
        </HeaderInformation>
        <HeaderIcon>    
            <IconButton>
                <AttachFile/>
            </IconButton>
            <IconButton>
                <MoreVert/>
            </IconButton>
        </HeaderIcon>
      </Header>
      <MessageContainer>
            {showMessages()}
            <EndOfMessage ref={endOfMessageRef}/>
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon/>
        <Input value={input} onChange={e => setInput(e.target.value)}/>
        <button hidden disabled={!input} type="Submit" onClick={sendMessage}>Send message</button>
        <Mic/>
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
flex:1;
outline:0;
border:none;
border-radius:10px;
background-color: whitesmoke ;
margin-left: 15px;
margin-right: 15px;
`;

const Header = styled.div`
position:sticky;
background-color:white;
z-index:100;
top:0;
display:flex;
padding:11px;
height:80px;
align-items:center;
border-bottom:2px solid whitesmoke;`;

const HeaderInformation = styled.div`
margin-left: 15px;
flex:1;

    > h3{
        margin-bottom: 3px;
    }
    > p{
        font-size: 14px;
        color:gray;
    }
`;
const EndOfMessage = styled.div`
margin-bottom:15px`;

const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
padding: 20px;
background-color: #e5ded8;
min-height:90vh;

`;

const InputContainer = styled.form`
display:flex;
align-items:center;
padding: 10px;
position:sticky;
bottom:0;
background-color: whitesmoke;
z-index:100;
`;

