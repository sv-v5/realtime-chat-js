const socket = io();
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

const username = prompt('Enter your username');
socket.emit('user-join', username);

// msg sent from server with type or identifier 'chat-message'
socket.on('chat-message', data => {appendMessage(data)} );

messageForm.addEventListener('submit', e => {
    // prevent default behavior of submitting form (opening a file behavior?). also prevents page refresh
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    // always scroll to the bottom. scrollTop is the amount of scrolling done on the element/container
    // https://stackoverflow.com/questions/25505778/automatically-scroll-down-chat-div
    var atbottom = false;
    if (messageContainer.scrollTop + messageContainer.clientHeight > messageContainer.scrollHeight -1) {
        atbottom = true;  // tolerate 0.5 units of height diff. sometimes chat divs are 'cut off'
    }
    messageContainer.append(messageElement);
    // add logic to show notice if there are new messages, if the user is not scrolled all the way down
    newMsgNotice = document.getElementById('new-message-notice');
    if (atbottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
        newMsgNotice.style['visibility'] = 'hidden';
    } else {
        newMsgNotice.style['visibility'] = 'visible';
    }
};
