import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData[location.pathname] } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'faceKey', ...(require('E:/web/guarderClient/guarderClient/src/models/faceKey.js').default) });
app.model({ namespace: 'global', ...(require('E:/web/guarderClient/guarderClient/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('E:/web/guarderClient/guarderClient/src/models/login.js').default) });
app.model({ namespace: 'setting', ...(require('E:/web/guarderClient/guarderClient/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('E:/web/guarderClient/guarderClient/src/models/user.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/org/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/userManagement/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/settings/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/dashboard/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/device/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/face/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/face/blacklist/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/face/visitor/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/log/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/log/query/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/workAttendance/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/workAttendance/rule/add/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/workAttendance/rule/edit/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/workAttendance/statistics/model.js').default) });
app.model({ namespace: 'model', ...(require('E:/web/guarderClient/guarderClient/src/pages/workAttendance/record/model.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
