package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.FriendRequestResponse;
import com.DarLink.DarLink.entity.FriendRequest;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }

    // send friend request
    @PostMapping("/api/friends/request")
    public ResponseEntity<FriendRequestResponse> sendRequest(@RequestParam Long receiverId) {
        User sender = getCurrentUser();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        FriendRequest request = friendService.sendRequest(sender, receiver);
        return ResponseEntity.ok(friendService.toResponse(request));
    }

    // accept friend request
    @PostMapping("/api/friends/accept")
    public ResponseEntity<FriendRequestResponse> acceptRequest(@RequestParam Long requestId) {
        User currentUser = getCurrentUser();
        FriendRequest request = friendService.acceptRequest(requestId, currentUser);
        return ResponseEntity.ok(friendService.toResponse(request));
    }

    // decline friend request
    @PostMapping("/api/friends/decline")
    public ResponseEntity<FriendRequestResponse> declineRequest(@RequestParam Long requestId) {
        User currentUser = getCurrentUser();
        FriendRequest request = friendService.declineRequest(requestId, currentUser);
        return ResponseEntity.ok(friendService.toResponse(request));
    }

    // cancel sent request
    @DeleteMapping("/api/friends/cancel")
    public ResponseEntity<String> cancelRequest(@RequestParam Long requestId) {
        User currentUser = getCurrentUser();
        friendService.cancelRequest(requestId, currentUser);
        return ResponseEntity.ok("Friend request cancelled");
    }

    // remove friend
    @DeleteMapping("/api/friends/remove")
    public ResponseEntity<String> removeFriend(@RequestParam Long requestId) {
        User currentUser = getCurrentUser();
        friendService.removeFriend(requestId, currentUser);
        return ResponseEntity.ok("Friend removed");
    }

    // get all friends
    @GetMapping("/api/friends")
    public List<FriendRequestResponse> getFriends() {
        User user = getCurrentUser();
        return friendService.getFriends(user)
                .stream()
                .map(friendService::toResponse)
                .toList();
    }

    // get received pending requests
    @GetMapping("/api/friends/requests/received")
    public List<FriendRequestResponse> getReceivedRequests() {
        User user = getCurrentUser();
        return friendService.getReceivedRequests(user)
                .stream()
                .map(friendService::toResponse)
                .toList();
    }

    // get sent pending requests
    @GetMapping("/api/friends/requests/sent")
    public List<FriendRequestResponse> getSentRequests() {
        User user = getCurrentUser();
        return friendService.getSentRequests(user)
                .stream()
                .map(friendService::toResponse)
                .toList();
    }
}