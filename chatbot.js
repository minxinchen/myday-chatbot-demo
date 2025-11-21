(function () {
  const WEBHOOK_URL = 'https://unguillotined-nebuly-mendy.ngrok-free.dev/webhook/708af31b-9843-46f8-9fd9-4d315c38160c';

  const init = () => {
    const style = document.createElement('style');
    style.textContent = `
      #myday-chatbot {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        background: #fff;
        border: 1px solid #d5d5d5;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(15,23,42,0.18);
        display: flex;
      }
      #myday-chatbot header {
        background: #0d6efd;
        color: #fff;
        padding: 10px 14px;
        font-weight: 600;
      }
      #myday-chatbot-log {
        flex: 1;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 14px;
        max-height: 260px;
        overflow-y: auto;
      }
      .bubble {
        padding: 10px 12px;
        border-radius: 10px;
        background: #f1f5f9;
        align-self: flex-start;
      }
      .bubble.me {
        background: #e7f1ff;
        align-self: flex-end;
      }
      #myday-chatbot form {
        display: flex;
        border-top: 1px solid #dbe0ea;
      }
      #myday-chatbot input {
        flex: 1;
        border: none;
        padding: 10px;
        font-size: 14px;
        outline: none;
      }
      #myday-chatbot button {
        background: #0d6efd;
        color: #fff;
        border: none;
        padding: 0 18px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'myday-chatbot';
    widget.innerHTML = `
      <div style="width:100%">
        <header>MYDAY Chatbot</header>
        <div id="myday-chatbot-log"></div>
        <form>
          <input type="text" placeholder="輸入訊息..." autocomplete="off" />
          <button type="submit">送出</button>
        </form>
      </div>
    `;
    document.body.appendChild(widget);

    const log = widget.querySelector('#myday-chatbot-log');
    const form = widget.querySelector('form');
    const input = widget.querySelector('input');

    const appendBubble = (text, isMe) => {
      const bubble = document.createElement('div');
      bubble.className = `bubble${isMe ? ' me' : ''}`;
      bubble.textContent = text;
      log.appendChild(bubble);
      log.scrollTop = log.scrollHeight;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      appendBubble(message, true);
      input.value = '';

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'sendMessage', chatInput: message }),
        });
        const text = await response.text();
        appendBubble(text || '已提交，請在 n8n 查看結果。', false);
      } catch (error) {
        appendBubble(`無法連線：${error.message}`, false);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
