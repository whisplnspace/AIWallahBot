const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

const GEMINI_API_KEY = "AIzaSyB9q-Zc4UylyI0bJa5eWtNcv7j9V9_Bp5";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

chatForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';

  // Show bot typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message';
  typingDiv.id = 'typing-indicator';
  typingDiv.textContent = 'AiWallahBot is typing...';
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          { parts: [ { text: message } ] }
        ]
      })
    });
    const data = await response.json();
    let botReply = "Sorry, no response.";

    if (
      data?.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0]?.content?.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      botReply = data.candidates[0].content.parts[0].text || botReply;
    }

    // Remove Markdown formatting (asterisks, bold, etc.)
    botReply = botReply.replace(/[*_`>#\-]/g, "");

    document.getElementById('typing-indicator')?.remove();
    addMessage(botReply, 'bot');
  } catch (err) {
    document.getElementById('typing-indicator')?.remove();
    addMessage("Bot error: " + err.message, 'bot');
  }
});

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
