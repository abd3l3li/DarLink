package com.DarLink.Darlink.repository;
import com.DarLink.Darlink.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Find chat history between two users
    List<Message> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
}