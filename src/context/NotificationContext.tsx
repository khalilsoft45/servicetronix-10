
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Notification } from "@/components/dashboard/NotificationsList";
import { sampleNotifications } from "@/data/sampleNotifications";

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "time" | "isNew">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const { user } = useAuth();

  // Filter notifications based on user role
  useEffect(() => {
    if (user) {
      // In a real app, you would fetch notifications from the server here
      console.log("User role changed, fetching notifications for:", user.role);
    }
  }, [user]);

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "time" | "isNew">) => {
    const newNotification: Notification = {
      ...notification,
      id: `NOTIF-${Date.now()}`,
      time: "Just now",
      isNew: true
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show a toast for the new notification
    toast.info(notification.title, {
      description: notification.message,
    });
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isNew: false } 
          : notification
      )
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead, 
        clearAll 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
