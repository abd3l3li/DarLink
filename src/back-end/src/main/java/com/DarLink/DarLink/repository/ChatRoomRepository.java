package com.DarLink.DarLink.repository;

import com.DarLink.DarLink.entity.ChatRoom;
import com.DarLink.DarLink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findChatRoomByUser1AndUser2(User user1, User user2);
    Optional<ChatRoom> findChatRoomByUser2AndUser1(User user2, User user1);
    @Query("SELECT r FROM ChatRoom r WHERE r.user1 = :user OR r.user2 = :user")
    List<ChatRoom> findAllRoomsByUser(@Param("user") User user);
}
