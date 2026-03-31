package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.*;
import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.ChatRoomService;
import com.DarLink.DarLink.service.MessageService;
import com.DarLink.DarLink.service.NotificationService;
import com.DarLink.DarLink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final UserService userService;
    private final ChatRoomService chatRoomService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // the path should be like this /api/rooms?user2Id=89
    @PostMapping("/api/rooms")
    public ResponseEntity<String> createRoom(@RequestParam Long user2Id) {
        User user1 = getCurrentUser();
        User user2 = userService.findById(user2Id).orElseThrow();
        chatRoomService.createRoom(user1, user2);

        notificationService.sendNotification(
                user2, "room_updated", user1.getUsername(), null,
                user1.getUsername() + " created a room with you", "/chat"
        );
        notificationService.sendNotification(
                user1, "room_updated", user2.getUsername(), null,
                "You created a room with " + user2.getUsername(), "/chat"
        );

        return ResponseEntity.ok("Chat room created successfully");
    }

    // the path should be like this /api/rooms/between?user2Id=89
    @GetMapping("/api/rooms/between")
    public ResponseEntity<ChatRoomResponse> getRoomInfo(@RequestParam Long user2Id) {
        User user1 = getCurrentUser();
        User user2 = userService.findById(user2Id).orElseThrow();
        ChatRoom room = chatRoomService.findRoom(user1, user2).orElseThrow();
        return ResponseEntity.ok(chatRoomService.toResponse(room));
    }

    // the path should be like this /api/rooms/messages?roomId=908
    @GetMapping("/api/rooms/messages")
    public List<MessageResponse> getMessages(@RequestParam Long roomId) {
        ChatRoom room = chatRoomService.getRoomById(roomId).orElseThrow();
        return messageService.getMessagesByRoom(room);
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            @Payload MessageRequest request,
            Principal principal) {

        String email = principal.getName();
        User sender = userRepository.findByEmail(email).orElseThrow();
        Long senderId = sender.getId();
        ChatRoom room = chatRoomService.getRoomById(roomId).orElseThrow();
        MessageResponse res = messageService.toResponse(
                messageService.sendMessage(sender, room, request.getContent())
        );
        messagingTemplate.convertAndSend("/topic/room." + roomId, res);

        User otherUser = room.getUser1().getId().equals(senderId)
                ? room.getUser2()
                : room.getUser1();

        notificationService.sendNotification(
                otherUser, "new_message", sender.getUsername(), roomId,
                sender.getUsername() + " sent you a message", "/chat/" + roomId
        );
    }

    // the path should be like this /api/rooms
    @GetMapping("/api/rooms")
    public List<ChatRoomResponse> getAllRoom() {
        User user = getCurrentUser();
        return chatRoomService.getRoomsForUser(user);
    }

    // the path should be like this /api/rooms/summaries
    @GetMapping("/api/rooms/summaries")
    public List<ChatRoomSummaryResponse> getRoomSummaries() {
        User user = getCurrentUser();
        return chatRoomService.getRoomSummariesForUser(user);
    }
}
