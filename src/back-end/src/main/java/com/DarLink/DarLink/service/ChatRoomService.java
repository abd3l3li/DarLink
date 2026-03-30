package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.ChatRoomResponse;
import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.exception.RoomAlreadyExistsException;
import com.DarLink.DarLink.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;

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
}
