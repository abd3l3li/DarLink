package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FriendStatusResponse {
    private Long userId;
    private String status; // none, pending, incoming, friend
    private Long requestId;

    public FriendStatusResponse(Long userId, String status, Long requestId) {
        this.userId = userId;
        this.status = status;
        this.requestId = requestId;
    }
}
