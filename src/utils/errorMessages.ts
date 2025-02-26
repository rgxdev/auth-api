// src/utils/errorMessages.ts
export const ERROR_MESSAGES = {
    // Calendar errors
    MISSING_TITLE: {code: 'E001', message: 'Title is required.'},
    MISSING_START_TIME: {code: 'E002', message: 'Start time is required.'},
    MISSING_END_TIME: {code: 'E003', message: 'End time is required.'},
    MISSING_EVENT_ID: {code: 'E004', message: 'Event ID is required.'},
    MISSING_NEW_START_TIME: {code: 'E005', message: 'New start time is required.'},
    MISSING_NEW_END_TIME: {code: 'E006', message: 'New end time is required.'},

    // Task errors
    MISSING_TASK_NAME: {code: 'E007', message: 'Task name is required.'},
    MISSING_TASK_DUE_DATE: {code: 'E008', message: 'Task due date is required.'},
    MISSING_TASK_ID: {code: 'E009', message: 'Task ID is required.'},

    // Grade errors
    MISSING_GRADE_NOTE: {code: 'E010', message: 'Grade note is required.'},
    MISSING_GRADE_TYPE: {code: 'E011', message: 'Grade type is required.'},
    MISSING_GRADE_SUBJECT: {code: 'E012', message: 'Grade subject is required.'},
    MISSING_GRADE_DATE: {code: 'E013', message: 'Grade date is required.'},
    MISSING_GRADE_ID: {code: 'E014', message: 'Grade ID is required.'},

    // Generic update errors
    MISSING_UPDATE_FIELD: {code: 'E015', message: 'At least one field must be provided for update.'},

    // Friend system errors
    MISSING_FRIEND_ID: {code: 'E020', message: 'Friend ID is required.'},
    FRIEND_REQUEST_ALREADY_EXISTS: {code: 'E021', message: 'A friend request already exists.'},
    CANNOT_ADD_SELF: {code: 'E022', message: 'You cannot add yourself as friend.'},
    FRIEND_REQUEST_NOT_FOUND: {code: 'E023', message: 'Friend request not found.'},
    NOT_AUTHORIZED: {code: 'E024', message: 'Not authorized to perform this action.'},

    // Vocab Trainer errors
    MISSING_FOLDER_NAME: {code: 'E030', message: 'Folder name is required.'},
    MISSING_FOLDER_ID: {code: 'E031', message: 'Folder ID is required.'},
    MISSING_FLASHCARD_FRONT: {code: 'E032', message: 'Flashcard front text is required.'},
    MISSING_FLASHCARD_BACK: {code: 'E033', message: 'Flashcard back text is required.'},
    MISSING_FLASHCARD_ID: {code: 'E034', message: 'Flashcard ID is required.'},
    MISSING_QUALITY: {code: 'E035', message: 'Quality rating is required for review.'},
    INVALID_QUALITY: {code: 'E036', message: 'Quality rating must be between 0 and 5.'},

    // Habit Tracker errors
    MISSING_HABIT_NAME: {code: 'E050', message: 'Habit name is required.'},
    MISSING_HABIT_ID: {code: 'E051', message: 'Habit ID is required.'},
    MISSING_ENTRY_DATE: {code: 'E052', message: 'Entry date is required.'},
    FREQUENCY_REQUIRED: {code: 'E053', message: 'Frequency is required.'},
    NO_UPDATE_FIELD: {code: 'E054', message: 'At least one field must be provided for update.'},
    HABIT_NOT_FOUND: {code: 'E055', message: 'Habit not found.'},

    // Study Session errors
    STUDY_SESSION_SUBJECT_REQUIRED: {code: 'E080', message: 'Subject is required.'},
    STUDY_SESSION_ID_REQUIRED: {code: 'E083', message: 'Study session ID is required.'},
    STUDY_SESSION_NOT_FOUND: {code: 'E085', message: 'Study session not found.'},

    // Goal Tracker errors
    MISSING_GOAL_TITLE: {code: 'E090', message: 'Goal title is required.'},
    MISSING_GOAL_ID: {code: 'E091', message: 'Goal ID is required.'},
    NO_GOAL_UPDATE_FIELD: {code: 'E092', message: 'At least one field must be provided for update.'},
    GOAL_NOT_FOUND: {code: 'E093', message: 'Goal not found.'},

    // Exam Schedule errors
    EXAM_SUBJECT_REQUIRED: {code: 'E070', message: 'Subject is required.'},
    EXAM_TYPE_REQUIRED: {code: 'E071', message: 'Exam type is required.'},
    EXAM_DATE_REQUIRED: {code: 'E072', message: 'Exam date is required.'},
    EXAM_START_TIME_REQUIRED: {code: 'E073', message: 'Exam start time is required.'},
    EXAM_END_TIME_REQUIRED: {code: 'E074', message: 'Exam end time is required.'},
    EXAM_ID_REQUIRED: {code: 'E075', message: 'Exam ID is required.'},
    NO_EXAM_UPDATE_FIELD: {code: 'E076', message: 'At least one field must be provided for update.'},
    EXAM_NOT_FOUND: {code: 'E077', message: 'Exam not found.'},

    // Note Module errors
    MISSING_NOTE_TITLE: {code: 'E100', message: 'Note title is required.'},
    MISSING_NOTE_CONTENT: {code: 'E101', message: 'Note content is required.'},
    MISSING_NOTE_ID: {code: 'E102', message: 'Note ID is required.'},
    MISSING_NOTE_SUBJECT: {code: 'E103', message: 'Note subject is required.'},
    NO_NOTE_UPDATE_FIELD: {code: 'E104', message: 'At least one field must be provided for update.'},
    NOTE_NOT_FOUND: {code: 'E105', message: 'Note not found.'},

    // Project Planner errors
    MISSING_PROJECT_TITLE: {code: 'E110', message: 'Project title is required.'},
    MISSING_PROJECT_ID: {code: 'E111', message: 'Project ID is required.'},
    NO_PROJECT_UPDATE_FIELD: {code: 'E112', message: 'At least one field must be provided for update.'},
    PROJECT_NOT_FOUND: {code: 'E113', message: 'Project not found.'},

    // Absence Record errors
    MISSING_ABSENCE_DATE: {code: 'E120', message: 'Absence date is required.'},
    MISSING_ABSENCE_TYPE: {code: 'E121', message: 'Absence type is required.'},
    MISSING_ABSENCE_ID: {code: 'E122', message: 'Absence record ID is required.'}
}
