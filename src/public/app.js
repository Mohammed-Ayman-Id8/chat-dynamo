// const socket = io("ws://localhost:3500/4");
const urlParams = new URLSearchParams(window.location.search); 
const roomId = urlParams.get('roomId');

const socket = io('http://localhost:5050', { query: { roomId: roomId, sender:'3',receiver:'1' } });

const activity = document.querySelector(".activity");
const msgInput = document.querySelector("input");

function sendMessage(e) {
  e.preventDefault();
  if (msgInput.value) {
    socket.emit("message", msgInput.value);
    msgInput.value = "";
  }
  msgInput.focus();
}

document.querySelector("form").addEventListener("submit", sendMessage);

// Listen for messages
socket.on("message", (data) => {
  activity.textContent = "";
  const li = document.createElement("li");
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", socket.id.substring(0, 5));
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;

  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 1000);
});
