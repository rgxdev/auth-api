// src/utils/errorMessages.ts
export const ERROR_MESSAGES = {
    // Friend system errors
    MISSING_FRIEND_ID: {code: 'E020', message: 'Friend ID is required.'},
    FRIEND_REQUEST_ALREADY_EXISTS: {code: 'E021', message: 'A friend request already exists.'},
    CANNOT_ADD_SELF: {code: 'E022', message: 'You cannot add yourself as friend.'},
    FRIEND_REQUEST_NOT_FOUND: {code: 'E023', message: 'Friend request not found.'},
    NOT_AUTHORIZED: {code: 'E024', message: 'Not authorized to perform this action.'},
}
