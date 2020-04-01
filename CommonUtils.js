const CommonUtils = {};

import { getCurrentConference } from './react/features/base/conference'

CommonUtils.PARTICIPANT_ROLE = {
    MODERATOR: 'moderator',
    NONE: 'none',
    PARTICIPANT: 'participant'
};

/**
 * get all participants
 */
CommonUtils.getParticipants = function() {
    const participants = APP.store.getState()['features/base/participants'] || [];
    return participants;
}

/**
 * get current participant
 */
CommonUtils.getLocalParticipant = function() {
    const participants = CommonUtils.getParticipants();
    const localParticipant = participants.find(p => p.local);
    return localParticipant;
}

/**
 * get current participant ID
 */
CommonUtils.getLocalParticipantId = function() {
    const localParticipant = CommonUtils.getLocalParticipant();
    return localParticipant && localParticipant.id;
}

/**
 * get current participant ID
 */
CommonUtils.getParticipantById = function(participantId) {
    const participants = CommonUtils.getParticipants();
    const participant = participants.find(p => p.id === participantId);
    return participant;
}


/**
 * Weather current participant is Host ?
 */
CommonUtils.isLocalParticipantHost = function() {
    const localParticipant = CommonUtils.getLocalParticipant();
    return localParticipant.isHost;
}

/**
 * get host
 */
CommonUtils.getHostParticipant = function() {
    const participants = CommonUtils.getParticipants();
    const participant = participants.find(p => p.isHost);
    return participant;
}

/**
 * Weather current participant is Moderator
 */
CommonUtils.isLocalParticipantModerator = function() {
    const localParticipant = CommonUtils.getLocalParticipant();
    return localParticipant.role === CommonUtils.PARTICIPANT_ROLE.MODERATOR;
}

/**
 * Weather this participant is Moderator
 */
CommonUtils.isThisParticipantModerator = function(participant) {
    return participant.role === CommonUtils.PARTICIPANT_ROLE.MODERATOR;
}

/**
 * get conference
 */
CommonUtils.getConference = function() {
    const state = APP.store.getState();
    const conference = getCurrentConference(state);
    return conference;
}

/**
 * get room info
 */
CommonUtils.getRoom = function() {
    return CommonUtils.getConference.room;
}

/**
 * get room id
 */
CommonUtils.getRoomId = function() {
    return CommonUtils.getConference.room.roomjid;
}

export default CommonUtils;
