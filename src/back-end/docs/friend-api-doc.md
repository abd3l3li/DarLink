# 📡 Friend API Documentation

## Base URL
`/api/friends`

---

## 1. Send Friend Request
**POST** `/request`

### Params
- `receiverId` (Long)

### Response
```json
{
  "id": 1,
  "senderId": 10,
  "senderUsername": "john",
  "receiverId": 20,
  "receiverUsername": "alice",
  "status": "PENDING",
  "createdAt": "2026-03-30T20:00:00"
}
```

---

## 2. Accept Friend Request
**POST** `/accept`

### Params
- `requestId` (Long)

---

## 3. Decline Friend Request
**POST** `/decline`

### Params
- `requestId` (Long)

---

## 4. Cancel Sent Request
**DELETE** `/cancel`

### Params
- `requestId` (Long)

### Response
```
Friend request cancelled
```

---

## 5. Remove Friend
**DELETE** `/remove`

### Params
- `requestId` (Long)

### Response
```
Friend removed
```

---

## 6. Get All Friends
**GET** `/`

### Response
List of `FriendRequestResponse`

---

## 7. Get Received Requests
**GET** `/requests/received`

### Response
List of pending requests where current user is receiver

---

## 8. Get Sent Requests
**GET** `/requests/sent`

### Response
List of pending requests where current user is sender

---

## 🔐 Notes
- All endpoints require authentication
- Current user is resolved from Spring Security context
- Authorization rules are enforced (sender/receiver only)
