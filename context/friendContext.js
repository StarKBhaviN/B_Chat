import { createContext, useContext, useEffect, useState } from "react";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  deleteFrndReqs,
  listenToFriendRequests,
} from "../utils/friendService"; // Adjust path as necessary

export const FriendContext = createContext();

export const FriendContextProvider = ({ children, userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToFriendRequests(userId, setFriendRequests);

    return () => {
      unsubscribe(); // Stop listening when the component unmounts or userId changes
    };
  }, [userId]);

  // Fetch friend requests
  const fetchFriendRequests = async (userId) => {
    const requests = await getFriendRequests(userId);
    setFriendRequests(requests);
  };

  // Send a friend request
  const sendRequest = async (senderId, receiverId, message) => {
    try {
      const result = await sendFriendRequest(senderId, receiverId, message);
      // Update the state immediately after sending the request
      // const newRequest = { senderId, receiverId, message };
      // setFriendRequests((prevRequests) => [...prevRequests, newRequest]);

      // Re-fetch to ensure any server-side updates are reflected
      await fetchFriendRequests(receiverId);

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
    const result = await deleteFrndReqs(userId, incomingId);
    await fetchFriendRequests(userId);
    return result;
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        setFriendRequests,
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
