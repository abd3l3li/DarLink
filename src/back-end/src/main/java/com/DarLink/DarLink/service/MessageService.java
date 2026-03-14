package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.MessageResponse;
import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.Message;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message sendMessage(User sender, ChatRoom room, String content) {
        Message message = new Message();
        message.setContent(content);
        message.setRoom(room);
        message.setSender(sender);
        return messageRepository.save(message);
    }

    public List<MessageResponse> getMessagesByRoom(ChatRoom room) {
        return messageRepository.findAllByRoom(room)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MessageResponse toResponse(Message message) {
        MessageResponse res = new MessageResponse();
        res.setId(message.getId());
        res.setContent(message.getContent());
        res.setSentAt(message.getSentAt());
        res.setRoomId(message.getRoom().getId());
        res.setSenderId(message.getSender().getId());
        res.setSenderUsername(message.getSender().getUsername());
        return res;
    }
}
