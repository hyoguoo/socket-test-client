import useMessageStore from '../hooks/useMessageStore';

export default function RoomList() {
  const messageStore = useMessageStore();

  const { connected, currentRoomShortUuid, roomIndices } = messageStore;

  const handleClickEnterRoom = ({ roomShortUuid: newRoomShortUuid }) => {
    if (connected) {
      messageStore.disconnect(currentRoomShortUuid);
    }
    messageStore.connect(newRoomShortUuid);
  };

  const handleClickQuitRoom = async () => {
    messageStore.disconnect(currentRoomShortUuid);
  };

  return (
    <div>
      <ul>
        {roomIndices.map((roomShortUuid) => (
          <li key={roomShortUuid}>
            <button
              type="button"
              disabled={roomShortUuid === currentRoomShortUuid}
              onClick={() =>
                handleClickEnterRoom({
                  previousRoomShortUuid: currentRoomShortUuid,
                  roomShortUuid,
                })
              }>
              Room {roomShortUuid}
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
