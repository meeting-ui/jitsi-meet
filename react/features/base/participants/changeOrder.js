// @flow

// import { StateListenerRegistry } from '../redux';
import {
    isLocalParticipantModerator, 
    getParticipants
} from '../participants';

import { PARTICIPANTS_ORDER_CHANGED, PARTICIPANT_ROLE } from './constants';

/**
 * Subscribes to changes to the Follow Me setting for the local participant to
 * notify remote participants of current user interface status.
 */
// StateListenerRegistry.register(
//     /* selector */ state => state['features/base/conference'].orderChanged,
//     /* listener */ (newOrder, store) => _sendOrderChangedCommand(newOrder, store));

/**
 * Sends the follow-me command, when a local property change occurs.
 *
 * @param {*} newOrder - The changed selected value from the selector.
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
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

export function changeParticipantOrderAfterHostChanged(newOrder) {
    const state = APP.store.getState();
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
    const participants = getParticipants(state)
    participants.forEach(participant => {
        if (participant.role === PARTICIPANT_ROLE.MODERATOR) {
            $('#participant_' + participant.id).insertBefore('#localVideoTileViewContainer');
        }
    });
    console.log('participants', participants)
}

export function getNewParticipantOrder() {
    const allParticipants = $("#filmstripRemoteVideosContainer > span");
    let newOrder = [];

    for (let i = 0; i < allParticipants.length; i++) {
        const participant = allParticipants[i]
        newOrder.push(participant.id);
    }

    return newOrder.join(',');
}

export function sortParticipantsByIPsOrder() {
    const ipsStr = localStorage.getItem('jitsi_user_ips');
    if (ipsStr) {
        const ipArr = ipsStr.split(',');
        
    }
}

