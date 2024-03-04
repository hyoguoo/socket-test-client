import useMessageStore from '../hooks/useMessageStore';

export default function RoomList() {
  const messageStore = useMessageStore();

  const { connected, currentRoomId, roomIndices } = messageStore;

  const handleClickEnterRoom = ({ newRoomId }) => {
    if (connected) {
      messageStore.disconnect(currentRoomId);
    }
    messageStore.connect(newRoomId);
  };

  const handleClickQuitRoom = async () => {
    messageStore.disconnect(currentRoomId);
  };

  return (
    <div>
      <ul>
        {roomIndices.map((roomId) => (
          <li key={roomId}>
            <button
              type="button"
              disabled={roomId === currentRoomId}
              onClick={() =>
                handleClickEnterRoom({
                  previousRoomId: currentRoomId,
                  newRoomId: roomId,
                })
              }>
              Room {roomId}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" disabled={!connected} onClick={() => handleClickQuitRoom()}>
        Disconnect
      </button>
    </div>
  );
}
