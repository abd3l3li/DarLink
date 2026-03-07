package com.test.chat;


public class Message {

  private String name;
  private String message;

  public Message() {
  }

  public Message(String name, String message) {
    this.name = name;
    this.message = message;
  }

  public String getName() {
    return name;
  }

  public String getMessage() {
    return this.message;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}