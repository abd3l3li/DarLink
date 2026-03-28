package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.NotificationResponse;
import com.DarLink.DarLink.entity.Notification;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // GET /api/notifications
    @GetMapping("/api/notifications")
    public List<NotificationResponse> getNotifications() {
        User user = getCurrentUser();
        return notificationService.getNotifications(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET /api/notifications/unread-count
    @GetMapping("/api/notifications/unread-count")
    public Map<String, Long> getUnreadCount() {
        User user = getCurrentUser();
        return Map.of("count", notificationService.getUnreadCount(user));
    }

    // POST /api/notifications/read
    @PostMapping("/api/notifications/read")
    public ResponseEntity<String> markAllAsRead() {
        User user = getCurrentUser();
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok("All notifications marked as read");
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse res = new NotificationResponse();
        res.setId(notification.getId());
        res.setType(notification.getType());
        res.setSenderUsername(notification.getSenderUsername());
        res.setRoomId(notification.getRoomId());
        res.setMessage(notification.getMessage());
        res.setLink(notification.getLink());
        res.setRead(notification.isRead());
        res.setCreatedAt(notification.getCreatedAt());
        return res;
    }

    // POST /api/notifications/read/{id} - mark specific notification as read
    @PostMapping("/api/notifications/read.{id}")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        User user = getCurrentUser();
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok("Notification marked as read");
    }
}