package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.ChatRoomResponse;
import com.DarLink.DarLink.dto.ChatRoomSummaryResponse;
import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.Message;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.exception.RoomAlreadyExistsException;
import com.DarLink.DarLink.repository.ChatRoomRepository;
import com.DarLink.DarLink.repository.MessageRepository;
import com.DarLink.DarLink.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;

    public void createRoom(User user1, User user2) {
        if (chatRoomRepository.findChatRoomByUser1AndUser2(user1, user2).isPresent() || chatRoomRepository.findChatRoomByUser2AndUser1(user2, user1).isPresent())
            throw new RoomAlreadyExistsException("The room is already exist!");
        ChatRoom room = new ChatRoom();
        room.setUser1(user1);
        room.setUser2(user2);
        chatRoomRepository.save(room);
    }

    public Optional<ChatRoom> findRoom(User user1, User user2) {
        Optional<ChatRoom> room = chatRoomRepository.findChatRoomByUser1AndUser2(user1, user2);
        if (room.isPresent()) return room;
        return chatRoomRepository.findChatRoomByUser2AndUser1(user2, user1);
    }

    public Optional<ChatRoom> getRoomById(Long id) {
        return chatRoomRepository.findById(id);
    }

    public ChatRoomResponse toResponse(ChatRoom room) {
        ChatRoomResponse res = new ChatRoomResponse();
        res.setId(room.getId());
        res.setCreatedAt(room.getCreatedAt());
        res.setUser1Id(room.getUser1().getId());
        res.setUsername1(room.getUser1().getUsername());
        res.setAvatarUrl1(room.getUser1().getAvatarUrl());
        res.setUser2Id(room.getUser2().getId());
        res.setUsername2(room.getUser2().getUsername());
        res.setAvatarUrl2(room.getUser2().getAvatarUrl());
        return res;
    }

    public List<ChatRoomResponse> getRoomsForUser(User user) {
        return chatRoomRepository.findAllRoomsByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ChatRoomSummaryResponse> getRoomSummariesForUser(User user) {
    return chatRoomRepository.findAllRoomsByUser(user)
        .stream()
        .map((room) -> toSummary(room, user))
        .sorted(Comparator
            .comparing(ChatRoomSummaryResponse::getLastMessageAt,
                Comparator.nullsLast(Comparator.reverseOrder()))
            .thenComparing(ChatRoomSummaryResponse::getRoomId, Comparator.reverseOrder()))
        .toList();
    }

    private ChatRoomSummaryResponse toSummary(ChatRoom room, User currentUser) {
    ChatRoomSummaryResponse summary = new ChatRoomSummaryResponse();
    summary.setRoomId(room.getId());

    User otherUser = room.getUser1().getId().equals(currentUser.getId())
        ? room.getUser2()
        : room.getUser1();

    summary.setOtherUserId(otherUser.getId());
    summary.setOtherUsername(otherUser.getUsername());
    summary.setOtherAvatarUrl(otherUser.getAvatarUrl());

    Optional<Message> latestMessage = messageRepository.findTopByRoomOrderBySentAtDesc(room);
    latestMessage.ifPresent(message -> {
        summary.setLastMessage(message.getContent());
        summary.setLastMessageAt(message.getSentAt());
    });

    long unreadCount = notificationRepository
        .countByRecipientAndReadFalseAndTypeAndRoomId(currentUser, "new_message", room.getId());
    summary.setUnreadCount(unreadCount);

    return summary;
    }
}
