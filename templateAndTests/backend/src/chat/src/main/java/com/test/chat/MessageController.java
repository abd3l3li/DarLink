package com.test.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/chat")
    @SendTo("/temp")
    public Message handlMessage(Message message) {
        System.out.println("Sending a message...");
        System.out.println("the name is => " + message.getName());
        System.out.println("the msg is => " + message.getMessage());
        return new Message(message.getName(), message.getMessage());
    }
}
