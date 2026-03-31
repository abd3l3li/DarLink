# Friend and friend-request API

This document summarizes the social endpoints used by chat and profile actions.

## auth

All endpoints require:

```http
Authorization: Bearer <jwt>
```

## endpoints

### send friend request

- **POST** `/api/friends/request`
- query/body includes `receiverId`

### accept request

- **POST** `/api/friends/accept`
- includes `requestId`

### decline request

- **POST** `/api/friends/decline`
- includes `requestId`

### cancel sent request

- **DELETE** `/api/friends/cancel`
- includes `requestId`

### remove friend

- **DELETE** `/api/friends/remove`
- includes `requestId`

### list friends

- **GET** `/api/friends/`

### list received pending requests

- **GET** `/api/friends/requests/received`

### list sent pending requests

- **GET** `/api/friends/requests/sent`

## response shape (request object)

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

## notes

- operations are authorized by current authenticated user
- sender/receiver ownership is validated server-side
