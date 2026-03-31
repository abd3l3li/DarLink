package com.DarLink.DarLink.repository;

import com.DarLink.DarLink.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    Optional<FriendRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    List<FriendRequest> findByStatusAndSenderIdAndReceiverIdIn(String status, Long senderId, Collection<Long> receiverIds);

    List<FriendRequest> findByStatusAndReceiverIdAndSenderIdIn(String status, Long receiverId, Collection<Long> senderIds);
}
