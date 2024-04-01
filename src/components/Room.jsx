import useMessageStore from '../hooks/useMessageStore';

import { chatType } from '../type/ChatType';

export default function Room() {
  const messageStore = useMessageStore();

  const { connected, messageEntered, messageLogs } = messageStore;

  const beforeUnloadListener = () => {
    if (connected) {
      messageStore.disconnect();
    }
  };

  window.addEventListener('beforeunload', beforeUnloadListener);

  const handleSubmit = (event) => {
    event.preventDefault();
    messageStore.sendMessage({ type: chatType.MESSAGE });
  };

  const handleChangeInput = (event) => {
    const { value } = event.target;
    messageStore.changeInput(value);
  };

  if (!connected) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message-to-send">Type Message</label>
        <input type="text" value={messageEntered} onChange={handleChangeInput} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messageLogs.map((message) => (
          <li key={message.id}>{message.value}</li>
        ))}
      </ul>
    </div>
  );
}
