package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.*;
import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.ChatRoomService;
import com.DarLink.DarLink.service.MessageService;
import com.DarLink.DarLink.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.broker.AbstractBrokerMessageHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final UserService userService;
    private final ChatRoomService chatRoomService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;


//    private User getCurrentUser() {
//        String email = (String) SecurityContextHolder
//                .getContext()
//                .getAuthentication()
//                .getPrincipal();
//        return userRepository.findByEmail(email).orElseThrow();
//    }
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
        User user1 = getCurrentUser();  // get user from  token (jwt)
        User user2 = userService.findById(user2Id).orElseThrow();
        chatRoomService.createRoom(user1, user2);

        NotificationMessage notification = new NotificationMessage();
        notification.setType("room_updated");
        notification.setRoomId(null);
        notification.setSenderUsername(user1.getUsername());

        messagingTemplate.convertAndSend("/topic/user." + user2.getEmail(), notification);
        messagingTemplate.convertAndSend("/topic/user." + user1.getEmail(), notification);
        return ResponseEntity.ok("Chat room created successfully");
    }
    // the path should be like this /api/rooms/between?user2Id=89
    @GetMapping("/api/rooms/between")
    public ResponseEntity<ChatRoomResponse> getRoomInfo(@RequestParam Long user2Id) {
        User user1 = getCurrentUser();  // get user from  token (jwt)
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

        UserDetails userDetails = (UserDetails) principal;
        User sender = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long senderId = sender.getId();
        ChatRoom room = chatRoomService.getRoomById(roomId).orElseThrow();
        MessageResponse res = messageService.toResponse(
                messageService.sendMessage(sender, room, request.getContent())
        );
        messagingTemplate.convertAndSend("/topic/room." + roomId, res);

        String otherUserEmail = room.getUser1().getId().equals(senderId)
                ? room.getUser2().getEmail()
                : room.getUser1().getEmail();

        NotificationMessage notification = new NotificationMessage();
        notification.setType("new_message");
        notification.setRoomId(roomId);
        notification.setSenderUsername(sender.getUsername());
        messagingTemplate.convertAndSend("/topic/user." + otherUserEmail, notification);
    }

    // the path should be like this /api/rooms
    @GetMapping("/api/rooms")
    public List<ChatRoomResponse> getAllRoom() {
        User user = getCurrentUser();                               // from token
        return chatRoomService.getRoomsForUser(user);
    }
}