package com.DarLink.DarLink.repository;

import com.DarLink.DarLink.entity.FriendRequest;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.enumm.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    // check if request already exists between two users
    boolean existsBySenderAndReceiver(User sender, User receiver);

    // get all received pending requests
    List<FriendRequest> findAllByReceiverAndStatus(User receiver, FriendRequestStatus status);

    // get all sent pending requests
    List<FriendRequest> findAllBySenderAndStatus(User sender, FriendRequestStatus status);

    // get all friends (accepted requests)
    @Query("SELECT f FROM FriendRequest f WHERE (f.sender = :user OR f.receiver = :user) AND f.status = 'ACCEPTED'")
    List<FriendRequest> findAllFriends(@Param("user") User user);
}