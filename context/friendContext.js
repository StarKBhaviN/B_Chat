import { createContext, useContext, useState } from "react";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  deleteFrndReqs,
} from "../utils/friendService"; // Adjust path as necessary

export const FriendContext = createContext();

export const FriendContextProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  // Fetch friend requests
  const fetchFriendRequests = async (userId) => {
    const requests = await getFriendRequests(userId);
    setFriendRequests(requests);
  };

  // Send a friend request
  const sendRequest = async (senderId, receiverId,message) => {
    try {
      const result = await sendFriendRequest(senderId, receiverId,message);
      return result; 
    } catch (error) {
      console.error("Error in sendRequest:", error.message);
      return "Failed to send request.";
    }
  };

  // Accept a friend request
  const acceptRequest = async (userId, friendId) => {
    const result = await acceptFriendRequest(userId, friendId);
    await fetchFriendRequests(userId); // Refresh friend requests
    return result;
  };

  //   Reject a friend request
  const delRequest = async (userId, incomingId) => {
    const result = await deleteFrndReqs(userId,incomingId);
    await fetchFriendRequests(userId);
    return result;
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        fetchFriendRequests,
        sendRequest,
        acceptRequest,
        delRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

// Custom hook for convenience
export const useFriendContext = () => useContext(FriendContext);
