const socket = io();
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const newMsgNotice = document.getElementById('new-message-notice');
const userList = document.getElementById('user-list');
const themeCheckbox = document.getElementById('theme-checkbox');

const username = prompt('Enter your username');
socket.emit('user-join', username);

// msg sent from server with type or identifier 'chat-message'
socket.on('chat-message', data => {appendMessage(data)} );
socket.on('user-list', data => { userList.innerText = 'Users: ' + data });

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
    if (atbottom) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
        newMsgNotice.style['visibility'] = 'hidden';
    } else {
        newMsgNotice.style['visibility'] = 'visible';
    }
};

// change theme color: dark, light
themeCheckbox.addEventListener('change', () => {
    if(themeCheckbox.checked) {
        document.body.style['background-color'] = '#323b57';
        document.body.style['color'] = '#f3f2ef';
    } else {
        document.body.style['background-color'] = '#fdecc5';
        document.body.style['color'] = '#1d1f1d';
    }
});
