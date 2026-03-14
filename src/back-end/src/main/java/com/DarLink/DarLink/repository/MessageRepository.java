package com.DarLink.DarLink.repository;

import com.DarLink.DarLink.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import com.DarLink.DarLink.entity.ChatRoom;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByRoom(ChatRoom chatRoom);
}
