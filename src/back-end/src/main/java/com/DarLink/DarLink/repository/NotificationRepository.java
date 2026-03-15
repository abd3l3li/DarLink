package com.DarLink.DarLink.repository;
import com.DarLink.DarLink.entity.Notification;
import com.DarLink.DarLink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByRecipientOrderByCreatedAtDesc(User recipient);
    long countByRecipientAndReadFalse(User recipient);
}