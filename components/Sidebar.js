import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import  ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import EmailValidator from 'email-validator';
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection,addDoc, where, query,add} from "firebase/firestore";
import {useCollection} from 'react-firebase-hooks/firestore';
import Chat from "./Chat";



const Sidebar = () => {
  const [user] = useAuthState(auth);
  const userChatRef = query(collection(db, "chats"),where("users", "array-contains", user.email));
  const [chatsSnapshot] = useCollection(userChatRef);


  const createChat = () => {
    const input = prompt("Please enter an email address for user you wish to chat with")

    if(!input) return null;


    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      // Create a reference to the "chats" collection
      const chatsCollection = collection(db, 'chats');

      // Use the addDoc function to add a new chat document
      addDoc(chatsCollection, {
        users: [user.email, input],
      })
        .then((docRef) => {
          console.log('Chat document written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error writing chat document: ', error);
        });
    }
  }
  

  const chatAlreadyExists = (recipientEmail) =>{
    !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0) 
  }

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
        <IconContainer>
            <IconButton>
             <ChatIcon/>
            </IconButton>
            <IconButton>
             <MoreVertIcon/>
            </IconButton>
        </IconContainer>
      </Header>
      <Search>
        <SearchIcon/>
        <SearchInput placeholder='Search in chat'/>
      </Search>
      <SidebarButton onClick={createChat}>Star a new chat</SidebarButton>

      {/* List of chat */}

      {chatsSnapshot?.docs.map((chat) =>(
        <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
      ))}
    </Container>
  );
}


export default Sidebar;

const Container = styled.div`
flex:0.45;
border-right:1px solid whitesmoke;
height:100vh;
min-width: 300px;
max-width:350px;
overflow: scroll;
overflow:hidden ;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width:none;
`;

const Search = styled.div`
display:flex;
align-items: center;
padding:20px;
border-radius:2px;
`;

const SidebarButton = styled(Button)`
width:100%;
  &&&{
    border-top:1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const SearchInput = styled.input`
outline-width:0;
border:none;
flex:1;
`;

const  Header = styled.div`
display:flex;
position: sticky;
top:0;
background-color:white;
z-index:1;
justify-content:space-between ;
align-items:center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke`;

const  UserAvatar = styled(Avatar)`
cursor:pointer;

    :hover{
        opacity:0.8;
    }
`;

const Name = styled.div``;
const IconContainer = styled.div``;
