// src/constants/notifications.ts

export const NotificationEvents = {
  // 🔹 User Lifecycle
  USER_FIRST_LOGIN: {
    title: "Welcome to MealPoint 🎉",
    message: "Thanks for joining us! Start exploring delicious meals today."
  },
  USER_NEW_LOGIN: {
    title: "New User Joined 👤",
    message: "A new user has logged into the system."
  },

  // 🔹 Order & Payment
  ORDER_PROCEEDED: {
    title: "Order Placed ✅",
    message: "Your order has been placed successfully. We’ll notify you when it’s on the way!"
  },
  ORDER_REJECTED: {
    title: "Order Rejected ❌",
    message: "Ooops! Your order has been rejected."
  },
  PAYMENT_SUCCESS: {
    title: "Payment Confirmed 💳",
    message: "Your payment was successful. Thank you for your purchase!"
  },
  ORDER_CREATED_ADMIN: {
    title: "New Order Created 🛒",
    message: "A user has just created a new order. Check details in the dashboard."
  },

  // 🔹 Promotions
  OFFER_OPENED: {
    title: "New Offer Available 🔥",
    message: "A restaurant has opened a new offer. Don’t miss the deal!"
  },
  NEW_ITEMS: {
    title: "Try Our New Dishes 🍕",
    message: "Exciting new items have been added to the menu. Check them out now!"
  },

  // 🔹 Admin Alerts
  USER_FEEDBACK: {
    title: "New Feedback Received 📝",
    message: "A user has submitted feedback. Please review it."
  },
  REPORT_REQUEST: {
    title: "Report Request 📊",
    message: "A user has requested to check the monthly report."
  },

  // 🔹 System Reminders
  MONTHLY_REPORT_REMINDER: {
    title: "Monthly Report Reminder ⏰",
    message: "Please review the monthly report in your admin dashboard."
  }
} as const;

export type NotificationKey = keyof typeof NotificationEvents;

