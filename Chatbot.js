import React, { useState } from "react";
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import the necessary module

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Messages state to store chat history
  const [input, setInput] = useState(""); // Input state for the user's message
  const [isChatVisible, setIsChatVisible] = useState(false); // State to toggle the chatbot visibility

  // Initialize GoogleGenerativeAI with your API key from environment variables
  const genAI = new GoogleGenerativeAI(
    process.env.REACT_APP_GEMINI_API ||
      "AIzaSyDLruYiPiL4q1oukxUg7Rn17G2i48osrLg"
  ); // API key from .env
  const model = genAI.getGenerativeModel({
    model: "tunedModels/student-5on47km211gq", // Your specific model ID
  });

  // Handle message sending to the chatbot
  const handleSendMessage = async () => {
    if (!input) return; // Do nothing if the input is empty

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: input },
    ]);

    try {
      // API call to generate content using the model
      const result = await model.generateContent(input);

      // Get the response text from the result
      const botReply = result.response.text();

      // Add the bot's reply to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botReply },
      ]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      // In case of an error, send a default error message from the bot
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "I'm having trouble responding right now." },
      ]);
    }

    // Clear the input after sending the message
    setInput("");
  };

  // Toggle the visibility of the chat window
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
      {/* Button to toggle chat visibility */}
      <button
        className="chatbot-toggle-button"
        onClick={toggleChatVisibility}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          zIndex: 9999,
        }}
      >
        {isChatVisible ? "Close" : "Open"}
      </button>

      {/* Conditionally render the Chatbot interface if it's visible */}
      {isChatVisible && (
        <div
          className="chatbox"
          style={{
            position: "fixed",
            bottom: "80px", // Adjust to ensure the button doesn't overlap with the chat
            right: "20px",
            width: "300px",
            height: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Display the chat messages */}
          <div
            className="messages-container"
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender}`}
                style={{
                  alignSelf:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.sender === "user" ? "#007bff" : "#f1f1f1",
                  color: message.sender === "user" ? "#fff" : "#000",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  margin: "5px 0",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                }}
              >
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          {/* Input and send button */}
          <div
            className="input-container"
            style={{ display: "flex", padding: "10px" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // Update input value
              placeholder="Type your message here"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginRight: "10px",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
