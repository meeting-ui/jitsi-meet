/* @flow */

import React from 'react';

import { translate } from '../../../base/i18n';
import { IconMicDisabled, IconModerator } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { getCurrentConference } from '../../../base/conference';
import { pinParticipant, getParticipants, isLocalParticipantModerator } from '../../../base/participants';


import AbstractMuteButton, {
    _mapStateToProps,
    type Props
} from '../AbstractMuteButton';

import RemoteVideoMenuButton from './RemoteVideoMenuButton';

/**
 * Implements a React {@link Component} which displays a button for audio muting
 * a participant in the conference.
 *
 * NOTE: At the time of writing this is a button that doesn't use the
 * {@code AbstractButton} base component, but is inherited from the same
 * super class ({@code AbstractMuteButton} that extends {@code AbstractButton})
 * for the sake of code sharing between web and mobile. Once web uses the
 * {@code AbstractButton} base component, this can be fully removed.
 */
class SetHostButton extends AbstractMuteButton {
    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._handleClick = this._handleClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _audioTrackMuted, participantID, t } = this.props;
        const muteConfig = _audioTrackMuted ? {
            translationKey: 'videothumbnail.muted',
            muteClassName: 'mutelink disabled'
        } : {
                translationKey: 'videothumbnail.domute',
                muteClassName: 'mutelink'
            };

        return (
            <RemoteVideoMenuButton
                buttonText={'设为主持人'}
                // displayClass={muteConfig.muteClassName}
                icon={IconModerator}
                id={`hostlink_${participantID}`}
                // eslint-disable-next-line react/jsx-handler-names
                onClick={this._handleClick} />

        );
    }

    _handleClick: () => void
    /**
    * Handles clicking / pressing the button, and kicks the participant.
    *
    * @private
    * @returns {void}
    */
    _handleClick() {
        const { _audioTrackMuted, participantID, t } = this.props;

        // Pin participant, it will automatically exit the tile view
        // dispatch(pinParticipant(this.props.participantID));
        console.log('set it as host')
        const state = APP.store.getState();
        const conference = getCurrentConference(state);

        if (!conference) {
            return;
        }

        // Only a moderator is allowed to send commands.
        if (!isLocalParticipantModerator(state)) {
            return;
        }

        conference.sendCommandOnce(
            'SET_AS_HOST', { attributes: { participantID } }
        );

    }

}

export default translate(connect(_mapStateToProps)(SetHostButton));
