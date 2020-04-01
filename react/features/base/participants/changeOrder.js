import { PARTICIPANTS_ORDER_CHANGED, PARTICIPANT_ROLE } from './constants';

/**
 * send new order to every one
 */
export function sendOrderChangedCommand(manual) { // eslint-disable-line no-unused-vars
    const conference = APP.CommonUtils.getConference();
    if (!conference) {
        return;
    }

    const newOrder = getNewParticipantOrder();
    conference.sendCommandOnce(
        PARTICIPANTS_ORDER_CHANGED,
        { attributes: { newOrder, manual: manual ? 'changed' : '' } }
    );
}

/**
 * is host changed the order
 */
function getManualChangedOrder() {
    const key = manualChangedOrderKey();
    return localStorage.getItem(key)
}

function isManualChangedOrder() {
    return getManualChangedOrder() == 'changed';
}

export function setManualChangedOrder() {
    const key = manualChangedOrderKey();
    localStorage.setItem(key, 'changed')
}

function manualChangedOrderKey() {
    const roomId = APP.CommonUtils.getRoomId;
    return roomId + '_manualChangedOrder';
}

/**
 * Host change the order and the order will send to everyone, when receive the new order, execute this method
 * @param {*} newOrder 
 */
export function changeParticipantOrderAfterHostChanged(attributes, hostId) {
    const localParticipantId = APP.CommonUtils.getLocalParticipantId();
    // if broadcast to itself, just don't do any thing.
    if (localParticipantId == hostId) {
        return;
    }

    const newOrder = attributes.newOrder;

    // const manual = attributes.manual;
    // if (manual) {
    //     setManualChangedOrder();
    // }

    // if host manual changed the order
    console.log('isManualChangedOrder()', isManualChangedOrder())
    if (isManualChangedOrder()) {
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
    if (hostId) {
        $('#participant_' + hostId).insertBefore('#localVideoTileViewContainer');
    }
}

/**
 * get order str
 */
export function getNewParticipantOrder() {
    let newOrder = getParticipantIDOrderArray();
    return newOrder.join(',');
}

/**
 * get order array
 */
function getParticipantIDOrderArray() {
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
        const sortByIPOrderIDArr = [];
        const ipArr = ipsStr.split(',');
        // sort by ip
        for (let i = 0; i < ipArr.length; i++) {
            const eachIp = ipArr[i];
            // use IP to find participant
            const participant = APP.CommonUtils.getParticipantByIP(eachIp);
            if (participant) {
                sortByIPOrderIDArr.push(participant.id)
            }
        }

        // add others participants to the end of sortByIPOrder
        const participantsOrder = getParticipantIDOrderArray();
        if (sortByIPOrderIDArr.length > 0) {
            for (let i = 0; i < participantsOrder.length; i++) {
                if (!sortByIPOrderIDArr.find(each => each == participantsOrder[i])) {
                    sortByIPOrderIDArr.push(participantsOrder[i]);
                }
            }
            
            // sort by IP
            changeParticipantOrderAfterHostChanged({newOrder: sortByIPOrderIDArr.join(',')});
            // broadcast the order to other participants
            sendOrderChangedCommand();
        }
    }
}

