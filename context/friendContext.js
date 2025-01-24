import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  deleteFrndReqs,
  listenToFriendRequests,
  removeFromFriend,
} from "../utils/friendService"; // Adjust path as necessary
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

export const FriendContext = createContext();

export const FriendContextProvider = ({ children, userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [fetchAllFriends, setAllFriends] = useState([]);
  const listeners = useRef(new Map());

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToFriendRequests(userId, setFriendRequests);

    return () => {
      unsubscribe(); // Stop listening when the component unmounts or userId changes
    };
  }, [userId]);

  // Fetch a user's friend IDs
  const fetchAllFrndID = async () => {
    const userDoc = await getDoc(doc(usersRef, userId));

    if (userDoc.exists()) {
      const friends = userDoc.data().friends || [];
      return friends;
    }
    return [];
  };

  // Subscribe to individual friend updates
  const subscribeToFriendUpdates = (friendId) => {
    if (!listeners.current.has(friendId)) {
      const unSub = onSnapshot(doc(usersRef, friendId), (docSnap) => {
        const updatedUser = docSnap.data();

        setAllFriends((prevFriends) => {
          const existingFriend = prevFriends.find((u) => u.userId === friendId);
          if (existingFriend) {
            // Update only if data has changed
            if (
              JSON.stringify(existingFriend) !== JSON.stringify(updatedUser)
            ) {
              return prevFriends.map((u) =>
                u.userId === friendId ? { ...u, ...updatedUser } : u
              );
            }
            return prevFriends; // No changes
          } else {
            return [...prevFriends, updatedUser]; // Add new friend
          }
        });
      });
      listeners.current.set(friendId, unSub);
    }
  };

  // Fetch all friend data
  const getAllFriendData = async () => {
    const friendIDs = await fetchAllFrndID();

    friendIDs.forEach((friendId) => {
      subscribeToFriendUpdates(friendId);
    });
  };

  // Remove a friend and refresh data
  const removeAsFriend = async (userId, friendId) => {
    const result = await removeFromFriend(userId, friendId);

    // Update frontend state
    setAllFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.userId !== friendId)
    );
    return result;
  };

  // Fetch friend requests
  const fetchFriendRequests = async (userId) => {
    const requests = await getFriendRequests(userId);
    setFriendRequests(requests);
  };

  // Send a friend request
  const sendRequest = async (senderId, receiverId, message) => {
    try {
      const result = await sendFriendRequest(senderId, receiverId, message);
      if (result.Success) {
        await fetchFriendRequests(receiverId);
      }
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

  // Reject a friend request
  const delRequest = async (userId, incomingId) => {
    const result = await deleteFrndReqs(userId, incomingId);
    await fetchFriendRequests(userId);
    return result;
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        fetchAllFriends,
        getAllFriendData,
        removeAsFriend,
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
