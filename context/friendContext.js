import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  deleteFrndReqs,
  listenToFriendRequests,
  removeFromFriend,
} from "../utils/friendService"; // Adjust path as necessary
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { roomsRef, usersRef } from "../firebaseConfig";
import { getRoomID } from "../utils/common";
import { ToastAndroid } from "react-native";

export const FriendContext = createContext();

export const FriendContextProvider = ({ children, userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [fetchAllFriends, setAllFriends] = useState([]);
  const listeners = useRef(new Map());

  useEffect(() => {
    // console.log("Running this")
    if (userId) {
      // console.log("Got in")
      getAllFriendDataWithMessages();
    }
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

  // Fetch all friends with last message
  const fetchFriendLastMessages = async (friendIds) => {
    try {
      const friendsWithMessages = await Promise.all(
        friendIds.map(async (friendId) => {
          if (!friendId) {
            console.error("Invalid friendId:", friendId);
            return null;
          }

          const roomId = getRoomID(userId, friendId);
          if (!roomId) {
            console.error(
              `Invalid roomId for userId: ${userId}, friendId: ${friendId}`
            );
            return { friendId, lastMessage: null };
          }

          const messagesRef = collection(doc(roomsRef, roomId), "messages");
          const lastMessageQuery = query(
            messagesRef,
            orderBy("createdAt", "desc"),
            limit(1)
          );

          const lastMessageSnap = await getDocs(lastMessageQuery);
          const lastMessage = lastMessageSnap.docs[0]?.data();

          return { friendId, lastMessage };
        })
      );

      return friendsWithMessages.filter(Boolean); // Filter out null entries
    } catch (error) {
      console.error("Error in fetchFriendLastMessages:", error);
      return [];
    }
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

  // Fetch all friends including all required home data
  const getAllFriendDataWithMessages = async () => {
    try {
      // Fetch all friend IDs
      const friendIDs = await fetchAllFrndID();

      // Fetch details for all friends
      const friendsWithDetails = await Promise.all(
        friendIDs.map(async (friendId) => {
          // Subscribe to real-time updates for each friend
          subscribeToFriendUpdates(friendId);

          // Fetch individual friend's data
          const friendDoc = await getDoc(doc(usersRef, friendId));
          if (friendDoc.exists()) {
            return { friendId, ...friendDoc.data() };
          }
          return null; // Skip if data doesn't exist
        })
      );

      // Remove null entries (for non-existent friends)
      const validFriends = friendsWithDetails.filter(Boolean);

      // Fetch the last message for each friend
      const friendsWithMessages = await fetchFriendLastMessages(friendIDs);

      // Combine friend details with their last message
      const combinedData = validFriends.map((friend) => {
        const lastMessage = friendsWithMessages.find(
          (message) => message.friendId === friend.friendId
        )?.lastMessage;
        return {
          ...friend,
          lastMessage: lastMessage || null, // Include lastMessage or null
        };
      });

      // Update the state with the combined data
      setAllFriends(combinedData);
      // console.log("Fetched : ",fetchAllFriends)
    } catch (error) {
      console.error("Error in getAllFriendDataWithMessages:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToFriendRequests(userId, setFriendRequests);

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // Fetch all friend data for search
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

    ToastAndroid.show("Removed as Friend.", ToastAndroid.SHORT)
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
    subscribeToFriendUpdates(userId);
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
        getAllFriendDataWithMessages,
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
