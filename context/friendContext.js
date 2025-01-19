import { createContext, useContext, useState } from "react";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
} from "../services/friendRequests"; // Adjust path as necessary

export const FriendContext = createContext();

export const FriendContextProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch friend requests
  const fetchFriendRequests = async (userId) => {
    const requests = await getFriendRequests(userId);
    setFriendRequests(requests);
  };

  // Send a friend request
  const sendRequest = async (senderId, receiverId) => {
    const result = await sendFriendRequest(senderId, receiverId);
    return result; // Return result to show success/error message
  };

  // Accept a friend request
  const acceptRequest = async (userId, friendId) => {
    const result = await acceptFriendRequest(userId, friendId);
    await fetchFriendRequests(userId); // Refresh friend requests
    return result;
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        fetchFriendRequests,
        sendRequest,
        acceptRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

// Custom hook for convenience
export const useFriendContext = () => useContext(FriendContext);
