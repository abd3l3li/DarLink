package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MessageResponse {
    private Long id;
    private String content;
    private LocalDateTime sentAt;
    private Long senderId;
    private String senderUsername;
    private Long roomId;
}
