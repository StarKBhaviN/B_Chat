import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { usersRef } from "../firebaseConfig";

// Utility function to get receiverId by profile name
export async function getReceiverIdByProfileName(profileName) {
  const querySnapshot = await getDocs(
    query(usersRef, where("profileName", "==", profileName))
  );
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].id;
}

// Send Friend Request
export const sendFriendRequest = async (senderId, receiverId, message) => {
  try {
    if (!senderId) {
      throw new Error("Invalid sender or receiver ID.");
    }

    const receiverDocRef = doc(usersRef, receiverId);

    // Fetch the receiver's data to check for existing connections
    const receiverDoc = await getDoc(receiverDocRef);
    if (!receiverDoc.exists()) {
      throw new Error("Receiver not found.");
    }

    const { friends = [], friendReqs = [] } = receiverDoc.data();

    // Check if the sender is already a friend or has sent a request
    if (friends.includes(senderId)) {
      return "You are already connected.";
    }

    if (friendReqs.includes(senderId)) {
      return "Friend request already sent.";
    }

    // Add senderId to the receiver's friendRequests array
    await updateDoc(receiverDocRef, {
      friendReqs: arrayUnion({
        senderId,
        message: message || "Hey, add me as your friend!", // Default message if none provided
        timestamp: Date.now(),
      }),
    });

    return "Friend request sent successfully.";
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    return error.message || "Failed to send friend request.";
  }
};

// Fetch All Friend Requests
export const getFriendRequests = async (userId) => {
  try {
    const userDocRef = doc(usersRef, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const friendRequests = userDoc.data().friendReqs || [];

      // Fetch details of users who sent friend requests
      const friendRequestsData = await Promise.all(
        friendRequests.map(async (req) => {
          const { senderId, message, timestamp } = req; // Extract message and timestamp
          const friendDocRef = doc(usersRef, senderId);
          const friendDoc = await getDoc(friendDocRef);

          if (friendDoc.exists()) {
            const { profileName, profileURL } = friendDoc.data();
            return { senderId, profileName, profileURL, message, timestamp };
          }
          return null;
        })
      );

      // Filter out null values (e.g., in case of missing documents)
      return friendRequestsData.filter((data) => data !== null);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error retrieving friend requests:", error);
    return [];
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (userId, senderId) => {
  try {
    console.log(userId, senderId)
    const userDocRef = doc(usersRef, userId);
    const senderDocRef = doc(usersRef, senderId);

    // Fetch user's current friend requests
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      throw new Error("User not found.");
    }

    const { friendReqs = [] } = userDoc.data();

    // Find the friend request object to remove
    const requestToRemove = friendReqs.find((req) => req.senderId === senderId);

    if (!requestToRemove) {
      throw new Error("Friend request not found.");
    }
    // Add senderId to user's friends array and vice versa
    await updateDoc(userDocRef, {
      friends: arrayUnion(senderId),
      friendReqs: arrayRemove(requestToRemove),
    });

    await updateDoc(senderDocRef, {
      friends: arrayUnion(userId),
    });

    return "Friend request accepted.";
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return "Failed to accept friend request.";
  }
};

export const deleteFrndReqs = async (userId, incomingId) => {
  try {
    const userDocRef = doc(usersRef, userId);

    // Fetch the user document
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const { friendReqs = [] } = userDoc.data();

      // Filter out the request by matching senderId
      const updatedFriendReqs = friendReqs.filter((req) => req.senderId !== incomingId);

      // Update the document with the filtered friend requests
      await updateDoc(userDocRef, {
        friendReqs: updatedFriendReqs,
      });
    }

    return "Friend request rejected.";
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return "Failed to reject friend request.";
  }
};
