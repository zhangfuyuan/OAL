import React, { Component, Fragment } from 'react';
import { Button, Upload, notification, Spin } from 'antd';
import logo from '@/assets/logo.png';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

class AuthorizedPoints extends Component {

  render() {
    const {
      currentUser,
      openAuthorizedPointsLoading,
      openAuthorizedPointsUpload,
    } = this.props;

    return (
      <div>
        <p style={{ lineHeight: '3' }}>
          <span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              <FormattedMessage id="oal.settings.totalAuthorizationPoints" /> :
            </span>
            <span style={{ margin: '0 50px 0 10px' }}>{currentUser.terminalTotal || '0'}</span>
          </span>
          <span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              <FormattedMessage id="oal.settings.available" /> :
            </span>
            <span style={{ margin: '0 50px 0 10px' }}>{currentUser.terminalTotal - (currentUser.terminalAssigned || 0) || '0'}</span>
          </span>
          <span>
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
              <FormattedMessage id="oal.settings.assigned" /> :
            </span>
            <span style={{ margin: '0 50px 0 10px' }}>{currentUser.terminalAssigned || '0'}</span>
          </span>
        </p>

        <Button size="large" onClick={openAuthorizedPointsLoading}>
          <FormattedMessage id="oal.settings.increase" />
        </Button>

        <div style={{ color: '#fff', textAlign: 'right' }}>
          {/* 留条后路 */}
          <span onClick={() => openAuthorizedPointsUpload('offline')} style={{ marginRight: '10px' }}>offline</span>
          <span onClick={() => openAuthorizedPointsUpload('net')}>net</span>
        </div>
      </div>
    );
  }
}

export default AuthorizedPoints;
