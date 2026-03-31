package com.DarLink.DarLink.dto;

import jakarta.validation.constraints.NotNull;

public class FriendRequestCreateRequest {

    @NotNull
    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
