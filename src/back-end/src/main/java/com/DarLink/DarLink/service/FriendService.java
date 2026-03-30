package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.FriendRequestResponse;
import com.DarLink.DarLink.entity.FriendRequest;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.enumm.FriendRequestStatus;
import com.DarLink.DarLink.repository.FriendRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final NotificationService notificationService;

    public FriendRequest sendRequest(User sender, User receiver) {
        // cannot send request to yourself
        if (sender.getId().equals(receiver.getId()))
            throw new RuntimeException("Cannot send friend request to yourself");

        // check if request already exists
        if (friendRequestRepository.existsBySenderAndReceiver(sender, receiver))
            throw new RuntimeException("Friend request already sent");

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        FriendRequest savedRequest = friendRequestRepository.save(request);

        // Send notification to receiver
        notificationService.sendNotification(
                receiver,
                "friend_request_received",
                sender.getUsername(),
                null,
                sender.getUsername() + " sent you a friend request!",
                "/friends/requests/received"
        );

        return savedRequest;
    }

    public FriendRequest acceptRequest(Long requestId, User currentUser) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // only receiver can accept
        if (!request.getReceiver().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized");

        request.setStatus(FriendRequestStatus.ACCEPTED);
        FriendRequest acceptedRequest = friendRequestRepository.save(request);

        // Send notification to sender that request was accepted
        notificationService.sendNotification(
                request.getSender(),
                "friend_request_accepted",
                request.getReceiver().getUsername(),
                null,
                request.getReceiver().getUsername() + " accepted your friend request!",
                "/friends"
        );

        return acceptedRequest;
    }

    public FriendRequest declineRequest(Long requestId, User currentUser) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // only receiver can decline
        if (!request.getReceiver().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized");

        request.setStatus(FriendRequestStatus.DECLINED);
        FriendRequest declinedRequest = friendRequestRepository.save(request);

        // Send notification to sender that request was declined
        notificationService.sendNotification(
                request.getSender(),
                "friend_request_declined",
                request.getReceiver().getUsername(),
                null,
                request.getReceiver().getUsername() + " declined your friend request.",
                "/friends/requests/sent"
        );

        return declinedRequest;
    }

    public void cancelRequest(Long requestId, User currentUser) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // only sender can cancel
        if (!request.getSender().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized");

        friendRequestRepository.delete(request);
    }

    public void removeFriend(Long requestId, User currentUser) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // both users can remove
        if (!request.getSender().getId().equals(currentUser.getId()) &&
                !request.getReceiver().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized");

        friendRequestRepository.delete(request);
    }

    public List<FriendRequest> getFriends(User user) {
        return friendRequestRepository.findAllFriends(user);
    }

    public List<FriendRequest> getReceivedRequests(User user) {
        return friendRequestRepository.findAllByReceiverAndStatus(user, FriendRequestStatus.PENDING);
    }

    public List<FriendRequest> getSentRequests(User user) {
        return friendRequestRepository.findAllBySenderAndStatus(user, FriendRequestStatus.PENDING);
    }

    public FriendRequestResponse toResponse(FriendRequest request) {
        FriendRequestResponse res = new FriendRequestResponse();
        res.setId(request.getId());
        res.setSenderId(request.getSender().getId());
        res.setSenderUsername(request.getSender().getUsername());
        res.setReceiverId(request.getReceiver().getId());
        res.setReceiverUsername(request.getReceiver().getUsername());
        res.setStatus(request.getStatus().name());
        res.setCreatedAt(request.getCreatedAt());
        return res;
    }
}