package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomSummaryResponse {
    private Long roomId;
    private Long otherUserId;
    private String otherUsername;
    private String otherAvatarUrl;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Long unreadCount;
}
