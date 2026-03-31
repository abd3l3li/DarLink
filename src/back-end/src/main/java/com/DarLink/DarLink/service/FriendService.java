package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.FriendStatusResponse;
import com.DarLink.DarLink.entity.FriendRequest;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.FriendRequestRepository;
import com.DarLink.DarLink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FriendService {

    private static final String PENDING = "PENDING";
    private static final String ACCEPTED = "ACCEPTED";

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<FriendStatusResponse> getStatuses(User currentUser, List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        List<Long> distinctIds = userIds.stream()
                .filter(Objects::nonNull)
                .filter(id -> !id.equals(currentUser.getId()))
                .distinct()
                .toList();

        if (distinctIds.isEmpty()) {
            return List.of();
        }

        Map<Long, FriendStatusResponse> result = new HashMap<>();
        for (Long id : distinctIds) {
            result.put(id, new FriendStatusResponse(id, "none", null));
        }

        List<FriendRequest> acceptedOutgoing = friendRequestRepository
                .findByStatusAndSenderIdAndReceiverIdIn(ACCEPTED, currentUser.getId(), distinctIds);
        List<FriendRequest> acceptedIncoming = friendRequestRepository
                .findByStatusAndReceiverIdAndSenderIdIn(ACCEPTED, currentUser.getId(), distinctIds);

        for (FriendRequest fr : acceptedOutgoing) {
            result.put(fr.getReceiver().getId(), new FriendStatusResponse(fr.getReceiver().getId(), "friend", fr.getId()));
        }
        for (FriendRequest fr : acceptedIncoming) {
            result.put(fr.getSender().getId(), new FriendStatusResponse(fr.getSender().getId(), "friend", fr.getId()));
        }

        List<FriendRequest> pendingOutgoing = friendRequestRepository
                .findByStatusAndSenderIdAndReceiverIdIn(PENDING, currentUser.getId(), distinctIds);
        List<FriendRequest> pendingIncoming = friendRequestRepository
                .findByStatusAndReceiverIdAndSenderIdIn(PENDING, currentUser.getId(), distinctIds);

        for (FriendRequest fr : pendingOutgoing) {
            FriendStatusResponse existing = result.get(fr.getReceiver().getId());
            if (existing == null || !"friend".equals(existing.getStatus())) {
                result.put(fr.getReceiver().getId(), new FriendStatusResponse(fr.getReceiver().getId(), "pending", fr.getId()));
            }
        }
        for (FriendRequest fr : pendingIncoming) {
            FriendStatusResponse existing = result.get(fr.getSender().getId());
            if (existing == null || !"friend".equals(existing.getStatus())) {
                result.put(fr.getSender().getId(), new FriendStatusResponse(fr.getSender().getId(), "incoming", fr.getId()));
            }
        }

        return distinctIds.stream()
                .map(result::get)
                .filter(Objects::nonNull)
                .toList();
    }

    public FriendStatusResponse createRequest(User sender, Long receiverId) {
        if (receiverId == null) {
            throw new RuntimeException("Receiver user id is required");
        }
        if (sender.getId().equals(receiverId)) {
            throw new RuntimeException("You cannot send a friend request to yourself");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + receiverId));

        Optional<FriendRequest> outgoingOpt = friendRequestRepository
                .findBySenderIdAndReceiverId(sender.getId(), receiverId);
        if (outgoingOpt.isPresent()) {
            FriendRequest existing = outgoingOpt.get();
            if (ACCEPTED.equals(existing.getStatus())) {
                return new FriendStatusResponse(receiverId, "friend", existing.getId());
            }
            return new FriendStatusResponse(receiverId, "pending", existing.getId());
        }

        Optional<FriendRequest> reverseOpt = friendRequestRepository
                .findBySenderIdAndReceiverId(receiverId, sender.getId());
        if (reverseOpt.isPresent()) {
            FriendRequest reverse = reverseOpt.get();
            if (ACCEPTED.equals(reverse.getStatus())) {
                return new FriendStatusResponse(receiverId, "friend", reverse.getId());
            }
            // auto-accept if there is an incoming pending request
            reverse.setStatus(ACCEPTED);
            FriendRequest saved = friendRequestRepository.save(reverse);
            
            // Notification for acceptance
            notificationService.sendNotification(
                    receiver,
                    "friend_accept",
                    sender.getUsername(),
                    null,
                    sender.getUsername() + " accepted your friend request.",
                    "/chat/" + sender.getId()
            );
            
            return new FriendStatusResponse(receiver.getId(), "friend", saved.getId());
        }

        FriendRequest created = new FriendRequest();
        created.setSender(sender);
        created.setReceiver(receiver);
        created.setStatus(PENDING);

        FriendRequest saved = friendRequestRepository.save(created);
        
        // Notification for request
        notificationService.sendNotification(
                receiver,
                "friend_request",
                sender.getUsername(),
                null,
                sender.getUsername() + " sent you a friend request.",
                "/chat/" + sender.getId()
        );

        return new FriendStatusResponse(receiver.getId(), "pending", saved.getId());
    }

    public FriendStatusResponse acceptRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found with id: " + requestId));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only receiver can accept this friend request");
        }
        if (!PENDING.equals(request.getStatus())) {
            throw new RuntimeException("Friend request is no longer pending");
        }

        request.setStatus(ACCEPTED);
        FriendRequest saved = friendRequestRepository.save(request);
        
        // Notification for acceptance
        notificationService.sendNotification(
                saved.getSender(),
                "friend_accept",
                currentUser.getUsername(),
                null,
                currentUser.getUsername() + " accepted your friend request.",
                "/chat/" + currentUser.getId()
        );
        
        return new FriendStatusResponse(saved.getSender().getId(), "friend", saved.getId());
    }

    public FriendStatusResponse cancelOrRejectRequest(User currentUser, Long requestId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found with id: " + requestId));

        if (!PENDING.equals(request.getStatus())) {
            throw new RuntimeException("Only pending friend requests can be deleted");
        }

        boolean isSender = request.getSender().getId().equals(currentUser.getId());
        boolean isReceiver = request.getReceiver().getId().equals(currentUser.getId());
        if (!isSender && !isReceiver) {
            throw new RuntimeException("You cannot modify this friend request");
        }

        Long otherUserId = isSender ? request.getReceiver().getId() : request.getSender().getId();
        
        // If the receiver declines the request, notify the sender
        if (isReceiver) {
            notificationService.sendNotification(
                    request.getSender(),
                    "friend_reject",
                    currentUser.getUsername(),
                    null,
                    currentUser.getUsername() + " declined your friend request.",
                    "/chat/" + currentUser.getId()
            );
        }
        
        friendRequestRepository.delete(request);
        return new FriendStatusResponse(otherUserId, "none", null);
    }

    public FriendStatusResponse unfriend(User currentUser, Long otherUserId) {
        if (otherUserId == null) {
            throw new RuntimeException("User id is required");
        }

        Optional<FriendRequest> first = friendRequestRepository
                .findBySenderIdAndReceiverId(currentUser.getId(), otherUserId);
        Optional<FriendRequest> second = friendRequestRepository
                .findBySenderIdAndReceiverId(otherUserId, currentUser.getId());

    FriendRequest relation = first.orElse(second.orElse(null));
        if (relation == null || !ACCEPTED.equals(relation.getStatus())) {
            throw new RuntimeException("Friend relationship not found");
        }

        friendRequestRepository.delete(relation);
        return new FriendStatusResponse(otherUserId, "none", null);
    }
}
