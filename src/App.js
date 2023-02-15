import './App.css';
import React, { useState ,useEffect} from 'react';
import { lexClient } from './lex/lexClient';
import { RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2"; // ES Modules import
import { ImpulseSpinner } from "react-spinners-kit";
function App() {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [sessionState, setSessionState] = useState({});
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState("session" + Math.floor(Math.random() * 1000000));
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

useEffect(() => {
    const scrollContainer = document.getElementById('scrollcontainer');
    if (scrollContainer) {
      scrollContainer.scrollIntoView({ behavior: 'smooth',block: 'end' });
    }
  }, [messages]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const lexParams = {
        botId: "EWDRNLED7D",
        botAliasId: "TSTALIASID",
        text: inputText,
        localeId: "en_US",
        sessionId: sessionId,
        userId: "chatbot", // For example, 'chatbot-demo'.
      };
      let inputTextCopy = inputText;
      setMessages([...messages,{content: inputTextCopy, sender: 'user'}]);
      setInputText('');
      setLoading(true);
      setSessionState({})
      try {
        const data = await lexClient.send(new RecognizeTextCommand(lexParams));
        setLoading(false);
        setSessionState(data.sessionState);
        if(data.messages)
        {
          setMessages([...messages,{content: inputText, sender: 'user'},{content: data.messages[0].content, sender: 'bot'}]);
        }
      } catch (error) {
        setLoading(false);

          setMessages([...messages,{content: inputText, sender: 'user'},{content: "Sorry, I didn't understand that. Please try again.", sender: 'bot'}]);
        
      }
  
      // if status is 400 show message that it is not found

   
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div className="container">
    <div className='row'>
      <div className='col-12'>
        <h1>BookBot</h1>
      </div>
    </div>
  <div className="row">
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="chat-box p-3">     
            <div className="d-flex justify-content-between align-items-start">
              <p className="mb-0 bg-secondary p-3 rounded text-white"  style={{textAlign:"left"}} >
                Hi, what can I help you with? (Book a hotel, Book a car)
              </p>
            </div>
            {messages.map((message, index) => {
              return (

                <div className={message.sender === 'user' ? 'd-flex align-items-start justify-content-end my-2':'d-flex align-items-start justify-content-start  my-2' } >
                  <p className={ message.sender ==='user'?'mb-0 p-3 rounded text-white bg-info':'mb-0 p-3 rounded text-white bg-secondary'} style={message.sender === 'user' ? {textAlign:"right"} : {textAlign:"left"} }>
                    {message.content}
                  </p>
                
                </div>
              )
            })}
            {loading && 
            <div className="d-flex justify-content-between align-items-start">
                  <div className="mb-0 bg-secondary p-3 rounded text-white"  style={{textAlign:"left"}} >
                   <ImpulseSpinner frontColor="white"/>
                  </div>

                </div>
}
            {sessionState && sessionState.intent && sessionState.intent.confirmationState === "Denied" && <p>Sorry, I didn't understand that. Please try again.</p>}
          {sessionState && sessionState.intent && sessionState.intent.confirmationState === "Confirmed" && 
          
          <div className='bg-success p-3 rounded mt-3'>
            <div className='text-white'>
              <p className='h1'>Booking Details</p>
            </div>
          {  
            Object.keys(sessionState.intent.slots).map((key, index) => {
              return (
                <p className='text-white' key={index}>{key}: {sessionState.intent.slots[key].value.interpretedValue}</p>
              
              )
            })
          }
           </div>
          }
            <div id='scrollcontainer'></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="input-group mb-3">
              <input type="text" className="form-control me-3 rounded-3" placeholder="Type your message here..." value={inputText}
              onChange={handleInputChange}/>
              <div className="input-group-append">
                <button className="btn btn-primary btn-lg" type="submit">Send</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

</>
  );
}

export default App;
