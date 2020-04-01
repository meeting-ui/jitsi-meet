// @flow

import React, { Component } from 'react';
// import { Text, TextInput, View } from 'react-native';
import type { Dispatch } from 'redux';

import { Dialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import {
    PARTICIPANT_ROLE,
    getLocalParticipant
} from '../../base/participants';
import { connect } from '../../base/redux';
// import SortableList from './sortable-list';
import { ReactSortable } from 'react-sortablejs';
import { sortParticipantsByIPsOrder } from '../../base/participants/changeOrder'


/**
 * The type of the React {@code Component} props of
 * {@link SortIPsDialog}.
 */
type Props = {

    /**
     * Redux store dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Current encoding format.
     */
    encodingFormat: string,

    /**
     * Whether the local user is the moderator.
     */
    isModerator: boolean,

    /**
     * Whether local recording is engaged.
     */
    isEngaged: boolean,

    /**
     * The start time of the current local recording session.
     * Used to calculate the duration of recording.
     */
    recordingEngagedAt: Date,

    /**
     * Stats of all the participant.
     */
    stats: Object,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
}

/**
 * The type of the React {@code Component} state of
 * {@link SortIPsDialog}.
 */
type State = {

    /**
     * The recording duration string to be displayed on the UI.
     */
    durationString: string
}

/**
 * A React Component with the contents for a dialog that shows information about
 * local recording. For users with moderator rights, this is also the "control
 * panel" for starting/stopping local recording on all clients.
 *
 * @extends Component
 */
class SortIPsDialog extends Component<Props, State> {

    /**
     * Initializes a new {@code SortIPsDialog} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code SortIPsDialog} instance with.
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            ipList: []
        };
        this._submitSortedIPs = this._submitSortedIPs.bind(this);
        this._addNewIP = this._addNewIP.bind(this);
        this._deleteIP = this._deleteIP.bind(this);
    }

    componentDidMount() {
        const ips = localStorage.getItem('jitsi_user_ips');

        if (ips) {
            const ipArr = ips.split(',');
            const ipList = this.state.ipList;
            ipArr.forEach((ip, index) => {
                ipList.push({id: index, ip})
            })
            this.setState({ ipList: ipList })
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isModerator, t } = this.props;

        // if (!isModerator) {
        //     return null;
        // }

        return (
            <Dialog
                cancelKey ='dialog.close'
                okKey = 'dialog.Ok'
                onSubmit = { this._submitSortedIPs }
                titleKey = 'sortIps.dialogTitle'>
                <div>
                    <button type='button' className='ip-button' onClick={ this._addNewIP }>添加 IP</button>
                    <div className='sort-container'>
                        <ReactSortable
                            list={this.state.ipList}
                            setList={newState => this.setState({ ipList: newState })}
                        >
                            {
                                this.state.ipList.map((item, index) => (
                                    <div className='ip-item' key={index}>
                                        <span>{item.ip}</span>
                                        <span className='ip-delete-icon'
                                            key={index}
                                            onClick={this._deleteIP.bind(this,item.ip)}
                                        >X</span>
                                    </div>
                                ))
                            }
                        </ReactSortable>
                    </div>
                </div>
            </Dialog>
        );
    }

    _submitSortedIPs() {
        const { localStorage } = window;
        const ipList = this.state.ipList;
        var ips = [];
        ipList.forEach(ipObj => {
            ips.push(ipObj.ip);
        })
        const ipsStr = ips.join(',');
        localStorage.setItem('jitsi_user_ips', ipsStr);
        APP.BroadcatCommondUtil.sendCommand("sortedIps", {attributes: {ipsStr}});
        // sort participants
        sortParticipantsByIPsOrder();
        return true;
    }

    _addNewIP() {
        const { ipList } = this.state;
        const result = window.prompt('请输入 IP 地址');
        ipList.push({id: ipList.length + 1, ip: result});
        this.setState({ ipList });
    }

    _deleteIP(ip) {
        const { ipList } = this.state;

        ipList.forEach((ipObj, index) => {
            if (ipObj.ip == ip) {
                ipList.splice(index, 1);
            }
        })
        this.setState({ ipList });
    }

    _saveIpStr(ipStr) {
        console.log('_saveIpStr', ipStr)
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code SortIPsDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     encodingFormat: string,
 *     isModerator: boolean,
 *     isEngaged: boolean,
 *     recordingEngagedAt: Date,
 *     stats: Object
 * }}
 */
function _mapStateToProps(state) {
    const {
        encodingFormat,
        isEngaged,
        recordingEngagedAt,
        stats
    } = state['features/local-recording'];
    const isModerator = APP.CommonUtils.isLocalParticipantModerator();

    return {
        encodingFormat,
        isModerator,
        isEngaged,
        recordingEngagedAt,
        stats
    };
}

export default translate(connect(_mapStateToProps)(SortIPsDialog));
