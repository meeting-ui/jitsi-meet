import {
    getParticipants
} from '../participants';

import { PARTICIPANTS_ORDER_CHANGED, PARTICIPANT_ROLE } from './constants';

/**
 * send new order to every one
 */
export function sendOrderChangedCommand() { // eslint-disable-line no-unused-vars
    const conference = APP.CommonUtils.getConference();
    if (!conference) {
        return;
    }

    const newOrder = getNewParticipantOrder();
    conference.sendCommandOnce(
        PARTICIPANTS_ORDER_CHANGED,
        { attributes: { newOrder } }
    );
}

/**
 * Host change the order and the order will send to everyone, when receive the new order, execute this method
 * @param {*} newOrder 
 */
export function changeParticipantOrderAfterHostChanged(newOrder, hostId) {
    const localParticipantId = APP.CommonUtils.getLocalParticipantId();
    // if broadcast to itself, just don't do any thing.
    if (localParticipantId == hostId) {
        return;
    }
    const newOrderArr = newOrder.split(',');
    // const allParticipants = $('#filmstripRemoteVideosContainer > span');

    for (let i = newOrderArr.length - 1; i >= 0; i--) {
        if (i == newOrderArr.length - 1) {
        if (i == localVideoTileViewContainer)
            $('#' + newOrderArr[i]).insertBefore('#localVideoTileViewContainer');
        } else {
            $('#' + newOrderArr[i]).insertBefore('#' + newOrderArr[i + 1]);
        }
    }

    // Moderator should list at the last one position
    $('#participant_' + hostId).insertBefore('#localVideoTileViewContainer');
}

/**
 * get order str
 */
export function getNewParticipantOrder() {
    let newOrder = getParticipantOrderArray();
    return newOrder.join(',');
}

/**
 * get order array
 */
function getParticipantOrderArray() {
    const allParticipants = $("#filmstripRemoteVideosContainer > span");
    let newOrder = [];

    for (let i = 0; i < allParticipants.length; i++) {
        const participant = allParticipants[i]
        newOrder.push(participant.id);
    }
    return newOrder;
}

export function sortParticipantsByIPsOrder() {
    const ipsStr = localStorage.getItem('jitsi_user_ips');
    if (ipsStr) {
        const sortByIPOrder = [];
        const participantsOrder = getParticipantOrderArray();
        const ipArr = ipsStr.split(',');
        for (let i = 0; i < ipArr.length; i++) {
            const eachIp = ipArr[i];
            // use IP to find participant

        }
    }
}

