export const sendPushNotification = async (
  pushToken,
  title,
  body,
  data = {}
) => {
  try {
    const message = {
      to: pushToken,
      sound: "default",
      title,
      body,
      data, // Optional data payload
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to send push notification:", response.statusText);
    } else {
      console.log("Push notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
