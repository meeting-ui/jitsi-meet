
const BroadcatCommondUtil = {};

import {
    isLocalParticipantModerator, 
    getParticipants
}  from './react/features/base/participants'

import { getCurrentConference } from './react/features/base/conference';

BroadcatCommondUtil.COMMON_COMMAND_TYPE = 'COMMON_COMMAND_TYPE';

// BroadcatCommondUtil.invokers = [];

// BroadcatCommondUtil.addInvoker = function(commandType, callback) {
//     const invoker = BroadcatCommondUtil.invokers.find(invoke => invoke.commandType === commandType);
//     if (invoker) {
//         invoker.callback = callback;
//     } else {
//         const newInvoker = {commandType, callback};
//         BroadcatCommondUtil.invokers.push(newInvoker);
//     }
// }

/**
 * 
 * @param {*} commandType mini type
 * @param {*} data 
 * {
 *  attributes: {
 *     commondType: test
 *  }
 * }
 * @param {*} hostAuthNeed do I need be host to send the command
 */
BroadcatCommondUtil.sendCommandOnce = function(commandType, data, hostAuthNeed = false) {
    BroadcatCommondUtil.basicSendCommand(true, commandType, data, hostAuthNeed)
}

/**
 * 
 * @param {*} commandType mini type
 * @param {*} data 
 * {
 *  attributes: {
 *     commondType: test
 *  }
 * }
 * @param {*} hostAuthNeed do I need be host to send the command
 */
BroadcatCommondUtil.sendCommand = function(commandType, data, callback, hostAuthNeed = false) {
    BroadcatCommondUtil.basicSendCommand(false, commandType, data, callback, hostAuthNeed);
}

/**
 * @param once is send command once or not
 * @param {*} commandType mini type
 * @param {*} data 
 * {
 *  attributes: {
 *     commondType: test
 *  }
 * }
 * @param {*} hostAuthNeed do I need be host to send the command
 */
BroadcatCommondUtil.basicSendCommand = function(once, commandType, data, hostAuthNeed = false) {
    const state = APP.store.getState();
    const conference = getCurrentConference(state);

    if (!conference) {
        return;
    }

    if (hostAuthNeed && !isLocalParticipantModerator(state)) {
        return;
    }

    // BroadcatCommondUtil.addInvoker(commandType, callback);

    data.attributes.commandType = commandType;
    // data.attributes.callback = callback;

    if (once) {
        conference.sendCommandOnce(
            BroadcatCommondUtil.COMMON_COMMAND_TYPE,
            data
        );
    } else {
        conference.sendCommand(
            BroadcatCommondUtil.COMMON_COMMAND_TYPE,
            data
        );
    }
}


BroadcatCommondUtil.listenerCallback = function(data, participantId) {
    console.log('data', data)
    console.log('participantId', participantId)

    // call back for react\features\sort-ips\components\SortIPsDialog.js
    if (data.attributes.commandType === 'sortedIps') {
        localStorage.setItem('jitsi_user_ips', data.attributes.ipsStr);
    }
}


export default BroadcatCommondUtil;
