import styled from "styled-components";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import ChatScreen from "@/components/ChatScreen";
import { collection, doc, query,orderBy, getDocs, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "@/utils/getRecipientEmail";



function Chat({chat,messages}) {
    const [user] = useAuthState(auth);
    
  return (
    <Container>
        <Head>
            <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        </Head>
        <Sidebar/>
        <ChatContainer>
            <ChatScreen chat={chat} messages={messages}/>
        </ChatContainer>
    </Container>
  )
}

export default Chat;


export async function getServerSideProps(context) {
  const chatId = context.query.id;

  // Create a reference to the chat document
  const chatDocRef = doc(db, 'chats', chatId);

  try {
    // Retrieve chat document data
    const chatDoc = await getDoc(chatDocRef);
    if (!chatDoc.exists()) {
      return {
        notFound: true,
      };
    }

    const chat = {
      id: chatDoc.id,
      ...chatDoc.data(),
    };
    
    // Create a reference to the messages subcollection, ordered by timestamp
    const messagesQuery = query(collection(chatDocRef, 'messages'), orderBy('timestamp', 'asc'));

    // Retrieve messages from the query
    const messagesSnapshot = await getDocs(messagesQuery);

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().getTime(),
    }));

    return {
      props: {
        messages: JSON.stringify(messages),
        chat: chat,
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}




const Container = styled.div`
display:flex;`;

const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100vh;
    ::-webkit-scrollbar{
        display:none;
    }
    -ms-overflow-style:none ;
    scrollbar-width: none;
`;