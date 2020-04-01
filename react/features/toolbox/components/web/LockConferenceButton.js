// @flow

import { createToolbarEvent, sendAnalytics } from '../../../analytics';
import { openDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { IconMuteEveryone, IconRoomLock, IconRoomUnlock } from '../../../base/icons';
import { getLocalParticipant, PARTICIPANT_ROLE } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox';
import { MuteEveryoneDialog } from '../../../remote-video-menu';
import { NOTIFICATION_TIMEOUT, showNotification } from '../../../notifications';
import { setPassword } from '../../../base/conference'; 

type Props = AbstractButtonProps & {

    /**
     * The Redux dispatch function.
     */
    dispatch: Function,

    /*
     ** Whether the local participant is a moderator or not.
     */
    isModerator: Boolean,

    /**
     * The ID of the local participant.
     */
    localParticipantId: string
};

/**
 * Implements a React {@link Component} which displays a button for audio muting
 * every participant (except the local one)
 */
class LockConferenceButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.lockConference';
    icon = IconRoomLock;
    // label = 'dialog.lockConference';
    label = '锁定会议';
    toggledIcon = IconRoomUnlock;
    // toggledLabel = 'dialog.unlockConference';
    toggledLabel = '解锁会议';

    randomPassword = '';
    /**
     * Handles clicking / pressing the button, and opens a confirmation dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {

        const { dispatch, _locked } = this.props;

        const { conference, locked } = this.props._state['features/base/conference'];
        if (_locked) {

            conference.unlock();
            dispatch(showNotification({
                titleArguments: {
                    name: '会议已解锁'
                },
                titleKey: '会议已解锁'
            }, NOTIFICATION_TIMEOUT));
        } else {
            // dispatch(beginRoomLockRequest());

            this.randomPassword = Math.floor(1000 + Math.random() * 9000);

            // this.props._state['features/base/conference/password'] = randomPassword; 

            // conference.lock(this.randomPasswor);

            dispatch(setPassword(conference, conference.lock, this.randomPassword));

            dispatch(showNotification({
                titleArguments: {
                    name: '会议已锁定'
                },
                titleKey: '会议已锁定'
            }, NOTIFICATION_TIMEOUT));
        }


    }


    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return !this.props.isModerator;
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._locked;
    }
}


/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Props} ownProps - The component's own props.
 * @returns {Object}
 */
function _mapStateToProps(state: Object, ownProps: Props) {

    const { conference, locked } = state['features/base/conference'];


    const localParticipant = getLocalParticipant(state);
    const isModerator = localParticipant.role === PARTICIPANT_ROLE.MODERATOR || localParticipant.isHost;
    const { visible } = ownProps;

    return {
        isModerator,
        localParticipantId: localParticipant.id,
        visible: isModerator,
        _state: state,
        _locked: Boolean(conference && locked)
    };
}

export default translate(connect(_mapStateToProps)(LockConferenceButton));
