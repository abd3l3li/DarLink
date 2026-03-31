package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomResponse {
    private Long id;
    private LocalDateTime createdAt;
    private Long user1Id;
    private String username1;
    private String avatarUrl1;
    private Long user2Id;
    private String username2;
    private String avatarUrl2;
}
