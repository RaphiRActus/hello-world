class TeamsChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    background-color: white;
                    height: 100%;
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                }
                header {
                    background-color: #6264a7;
                    color: white;
                    padding: 10px;
                    font-size: 1.2em;
                }
                #messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    background-color: #f3f2f1;
                }
                .message {
                    margin-bottom: 10px;
                    max-width: 80%;
                }
                .message.sent {
                    align-self: flex-end;
                    background-color: #d1d1d1;
                    border-radius: 8px 8px 0 8px;
                    padding: 8px;
                }
                .message.received {
                    align-self: flex-start;
                    background-color: #e5e5f1;
                    border-radius: 8px 8px 8px 0;
                    padding: 8px;
                }
                footer {
                    display: flex;
                    padding: 10px;
                    background-color: #f3f2f1;
                }
                input[type="text"] {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    margin-left: 5px;
                    background-color: #6264a7;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <header>Teams Chat</header>
            <div id="messages"></div>
            <footer>
                <input type="text" id="input" placeholder="Type a message" />
                <button id="sendBtn">Send</button>
            </footer>
        `;
    }
    connectedCallback() {
        this.shadowRoot.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        this.shadowRoot.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    sendMessage() {
        const input = this.shadowRoot.getElementById('input');
        const text = input.value.trim();
        if (!text) return;
        const msg = document.createElement('div');
        msg.className = 'message sent';
        msg.textContent = text;
        this.shadowRoot.getElementById('messages').appendChild(msg);
        input.value = '';
        this.shadowRoot.getElementById('messages').scrollTop = this.shadowRoot.getElementById('messages').scrollHeight;
    }
}
customElements.define('teams-chat', TeamsChat);
