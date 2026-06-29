# DevTinder API List

## AuthenticationRouter

- POST /signup
- POST /login
- POST /logout

## ProfileRouter

- GET /profile
- PATCH /profile/edit
- PATCH /profile/changePassword
- DELETE /profile/delete

## RequestsRouter

- POST /requests/send/notice/:toUserId - send connection request (swipe right or something)
- POST /requests/send/skip/:toUserId - skip the current user (swipe left or something)
- POST /requests/review/accept/:requestId - accept a request sent by another user
- POST /requests/review/ignore/:requestId - reject/ignore a request sent by another user (the other user won't be notified of this)

## UserRouter

- GET /user/requests/recieved
- GET /user/connections
- GET /user/requests/sent
- GET /user/feed
