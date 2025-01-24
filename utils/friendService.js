import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { usersRef } from "../firebaseConfig";
import { sendPushNotification } from "./pushNotification";

export const listenToFriendRequests = (userId, callback) => {
  const userDocRef = doc(usersRef, userId);
  const unsubscribe = onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      const { friendReqs = [] } = doc.data();
      callback(friendReqs);
    }
  });
  return unsubscribe;
};

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
      return { Success: false, Message: "Invalid sender or receiver ID." };
    }
    if (!receiverId) {
      return { Success: false, Message: "Bee User not found." };
    }

    const senderDocRef = doc(usersRef, senderId);
    const receiverDocRef = doc(usersRef, receiverId);

    const senderDoc = await getDoc(senderDocRef);
    // Fetch the receiver's data to check for existing connections
    const receiverDoc = await getDoc(receiverDocRef);

    if (!receiverDoc.exists()) {
      throw new Error("Receiver not found.");
    }

    const { profileName } = senderDoc.data();
    const { friends = [], friendReqs = [], pushToken } = receiverDoc.data();

    // Check if the sender is already a friend or has sent a request
    if (friends.includes(senderId)) {
      return { Success: false, Message: "You are already connected." };
    }

    // Check if a friend request has already been sent
    const isAlreadyRequested = friendReqs.some(
      (req) => req.senderId === senderId
    );

    if (isAlreadyRequested) {
      return { Success: false, Message: "Friend request already sent." };
    }

    // Add senderId to the receiver's friendRequests array
    await updateDoc(receiverDocRef, {
      friendReqs: arrayUnion({
        senderId,
        message: message,
        timestamp: Date.now(),
      }),
    });

    await sendPushNotification(
      pushToken,
      `Bee Request : ${profileName}`,
      `${profileName} sent you a bee request.\nMSG : ${message}`,
      {
        noti_type: "Friend_Request",
        senderId: senderId,
        senderName: profileName,
      }
    );
    return { Success: true, Message: "Friend request sent successfully." };
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
          console.log(senderId);
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
    const userDocRef = doc(usersRef, userId);
    const senderDocRef = doc(usersRef, senderId);

    // Fetch user's current friend requests
    const userDoc = await getDoc(userDocRef);
    const senderDoc = await getDoc(senderDocRef);
    if (!userDoc.exists()) {
      throw new Error("User not found.");
    }

    const { profileName, friendReqs = [] } = userDoc.data();
    const { pushToken } = senderDoc.data();

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

    await sendPushNotification(
      pushToken,
      `Bee Accepted : ${profileName}`,
      `${profileName} Accepted your Bee request.`,
      {
        noti_type: "Friend_Accepted",
        senderId: senderId,
        senderName: profileName,
      }
    );
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
      const updatedFriendReqs = friendReqs.filter(
        (req) => req.senderId !== incomingId
      );

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

// Friend Mangement

export const removeFromFriend = async (userId, friendId) => {
  try {
    const userDocRef = doc(usersRef, userId);
    const friendDocRef = doc(usersRef, friendId);

    // Fetch the user document
    const userDoc = await getDoc(userDocRef);
    const friendDoc = await getDoc(friendDocRef);

    if (userDoc.exists() && friendDoc.exists()) {
      await updateDoc(userDocRef, {
        friends: arrayRemove(friendId),
      });
      await updateDoc(friendDocRef, {
        friends: arrayRemove(userId),
      });
    }

    return "Removed from Friends.";
  } catch (error) {
    console.error("Error Removing friend :", error);
    return "Failed to Remove From Friends.";
  }
};
