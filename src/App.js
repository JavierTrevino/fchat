import './App.css';
import {useState} from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { async } from '@firebase/util';

firebase.initializeApp({
  apiKey: "AIzaSyDFjYF2koE1yQYM01j3lkW-0G-gsLLkrIU",
  authDomain: "chat-c6028.firebaseapp.com",
  projectId: "chat-c6028",
  storageBucket: "chat-c6028.appspot.com",
  messagingSenderId: "385971257599",
  appId: "1:385971257599:web:a7e1e851e1214132c7ccca",
  measurementId: "G-T7ZX67NMKR"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>

      </header>

      <section>
        {<ChatRoom />}
      </section>
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, {idField: "id"});

  const [formValue, setFormValue] = useState("");

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue("");

  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit">Enviar</button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";

  return(
    <div className={"message ${messageClass}"}>
      <p>{text}</p>
    </div>
  )
}

export default App;
