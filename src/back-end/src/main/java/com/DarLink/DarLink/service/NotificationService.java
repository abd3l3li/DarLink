package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.NotificationMessage;
import com.DarLink.DarLink.entity.Notification;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(User recipient, String type, String senderUsername,
                                 Long roomId, String message, String link) {
        // save to DB
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setSenderUsername(senderUsername);
        notification.setRoomId(roomId);
        notification.setMessage(message);
        notification.setLink(link);
        notificationRepository.save(notification);

        // send via WebSocket
        NotificationMessage wsNotification = new NotificationMessage();
        wsNotification.setType(type);
        wsNotification.setRoomId(roomId);
        wsNotification.setSenderUsername(senderUsername);
        messagingTemplate.convertAndSend("/topic/user." + recipient.getEmail(), wsNotification);
    }

    public List<Notification> getNotifications(User user) {
        return notificationRepository.findAllByRecipientOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository
                .findAllByRecipientOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getRecipient().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}