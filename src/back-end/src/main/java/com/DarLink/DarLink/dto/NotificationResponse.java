package com.DarLink.DarLink.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;
    private String senderUsername;
    private Long roomId;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;
}