(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"/2/m":function(e,a,t){e.exports={myPageHeaderWrapper:"antd-pro-pages-user-management-style-myPageHeaderWrapper",tableList:"antd-pro-pages-user-management-style-tableList",tableListOperator:"antd-pro-pages-user-management-style-tableListOperator",tableListForm:"antd-pro-pages-user-management-style-tableListForm",submitButtons:"antd-pro-pages-user-management-style-submitButtons",card:"antd-pro-pages-user-management-style-card"}},AInq:function(e,a,t){"use strict";var l=t("g09b"),n=t("tAuX");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("IzEo");var r=l(t("bx4M"));t("14J3");var s=l(t("BMrR"));t("+L6B");var o=l(t("2/Rp"));t("jCWc");var d=l(t("kPKH"));t("5NDa");var i=l(t("5rEg")),u=l(t("p0pE"));t("miYZ");var m=l(t("tsqr"));t("/zsF");var c=l(t("PArb")),f=l(t("2Taf")),g=l(t("vZ4D")),p=l(t("l4Ni")),h=l(t("ujKo")),b=l(t("MhPg"));t("OaEy");var M=l(t("2fM7"));t("y8nQ");var v=l(t("Vl3Y"));t("2qtc");var y,E,L,S=l(t("kLXV")),k=n(t("q1tI")),w=t("Hx5s"),U=t("MuoO"),C=(l(t("wd/R")),l(t("3a4m")),t("LvDl"),l(t("Ivs8"))),N=l(t("HGS4")),V=l(t("TIwi")),x=l(t("G4ee")),R=l(t("/2/m")),F=t("Y2fQ");l(t("wY1l"));function O(e){return function(){var a,t=(0,h.default)(e);if(I()){var l=(0,h.default)(this).constructor;a=Reflect.construct(t,arguments,l)}else a=t.apply(this,arguments);return(0,p.default)(this,a)}}function I(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}S.default.confirm;var P=v.default.Item,A=(M.default.Option,y=(0,U.connect)(function(e){var a=e.user.currentUser,t=e.userManagement,l=e.loading;return{currentUser:a,userManagement:t,userListLoading:l.effects["userManagement/fetch"],addLoading:l.effects["userManagement/add"],modifyLoading:l.effects["userManagement/modify"],handleStateLoading:l.effects["userManagement/handleState"],resetPswLoading:l.effects["userManagement/resetPsw"]}}),y((L=function(e){(0,b.default)(t,e);var a=O(t);function t(){var e;(0,f.default)(this,t);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return e=a.call.apply(a,[this].concat(n)),e.state={modalVisible:!1,resetVisible:!1,delVisible:!1,formValues:{},selectedRows:[],selectedUser:{},page:{current:1,pageSize:10}},e.columns=[{title:(0,F.formatMessage)({id:"oal.user-manage.accountName"}),dataIndex:"userName",key:"userName",render:function(e,a){return k.default.createElement("span",null,a&&a.userName||"-")}},{title:(0,F.formatMessage)({id:"oal.common.nickname"}),key:"nickname",dataIndex:"nickname",render:function(e,a){return k.default.createElement("span",null,a&&a.profile&&a.profile.nickName||"-")}},{title:(0,F.formatMessage)({id:"oal.common.phoneNumber"}),key:"phoneNumber",dataIndex:"phoneNumber",render:function(e,a){return k.default.createElement("span",null,a&&a.profile&&a.profile.mobile||"-")}},{title:(0,F.formatMessage)({id:"oal.common.email"}),key:"email",dataIndex:"email",render:function(e,a){return k.default.createElement("span",null,a&&a.profile&&a.profile.email||"-")}},{title:(0,F.formatMessage)({id:"oal.common.handle"}),key:"handle",render:function(a,t){return k.default.createElement(k.Fragment,null,k.default.createElement("a",{onClick:function(){return e.handleUpdateModalVisible(t)}},k.default.createElement(F.FormattedMessage,{id:"oal.common.modify"})),k.default.createElement(c.default,{type:"vertical"}),k.default.createElement("a",{onClick:function(){return e.openResetModal(t)}},k.default.createElement(F.FormattedMessage,{id:"oal.user-manage.resetPassword"})),k.default.createElement(c.default,{type:"vertical"}),1===t.state?k.default.createElement("a",{onClick:function(){return e.openDelModal(t)},disabled:e.props.currentUser._id===t._id},k.default.createElement(F.FormattedMessage,{id:"oal.common.disable"})):k.default.createElement("a",{onClick:function(){return e.handleState(1,t._id)}},k.default.createElement(F.FormattedMessage,{id:"oal.common.enable"})))}}],e.handleState=function(a,t){var l=e.props.dispatch,n=a;l({type:"userManagement/handleState",payload:{userId:t,state:a}}).then(function(a){a&&a.res>0&&(m.default.success((0,F.formatMessage)({id:n?"oal.user-manage.beenEnabled":"oal.user-manage.beenDisabled"})),e.closeDelModal(),e.loadUserList())})},e.loadUserList=function(){var a=e.props.dispatch,t=e.state,l=t.page,n=t.formValues;a({type:"userManagement/fetch",payload:(0,u.default)({},l,n)})},e.deleteUser=function(a){e.handleState(0,a._id)},e.resetPsw=function(a){var t=e.props.dispatch;t({type:"userManagement/resetPsw",payload:{userId:a._id}}).then(function(a){a&&a.res>0&&(m.default.success((0,F.formatMessage)({id:"oal.org.resetSuccessfully"})),e.closeResetModal(),e.loadUserList())})},e.handleSearch=function(){var a=e.props.form;a.validateFields(function(a,t){if(!a){var l=e.state.page;e.setState({page:(0,u.default)({},l,{current:1}),formValues:t,selectedRows:[]},function(){e.loadUserList()})}})},e.handleFormReset=function(){var a=e.props.form;a.resetFields(),a.setFieldsValue({}),e.setState({page:{current:1,pageSize:10},formValues:{},selectedRows:[]},function(){e.loadUserList()})},e.handleUpdateModalVisible=function(a){e.setState({modalVisible:!0,selectedUser:a})},e.toAdd=function(){e.setState({modalVisible:!0})},e.openResetModal=function(a){e.setState({resetVisible:!0,selectedUser:a})},e.openDelModal=function(a){e.setState({delVisible:!0,selectedUser:a})},e.closeAddOrUpdateModal=function(){e.setState({modalVisible:!1,selectedUser:{}})},e.closeResetModal=function(){e.setState({resetVisible:!1,selectedUser:{}})},e.closeDelModal=function(){e.setState({delVisible:!1,selectedUser:{}})},e.submitAddOrUpdate=function(a,t){var l=e.props.dispatch,n=e.state.selectedUser;n&&n._id?l({type:"userManagement/modify",payload:a}).then(function(a){a&&a.res>0&&(m.default.success((0,F.formatMessage)({id:"oal.common.modifySuccessfully"})),e.closeAddOrUpdateModal(),e.loadUserList(),t())}):l({type:"userManagement/add",payload:a}).then(function(a){a&&a.res>0&&(m.default.success((0,F.formatMessage)({id:"oal.face.addSuccessfully"})),e.closeAddOrUpdateModal(),e.loadUserList(),t())})},e.renderSimpleForm=function(){var a=e.props,t=a.form,l=a.userListLoading,n=t.getFieldDecorator;return k.default.createElement(v.default,{layout:"inline"},k.default.createElement(s.default,{gutter:{md:4,lg:24,xl:48}},k.default.createElement(d.default,{xxl:6,xl:10,lg:10,md:10,sm:24},k.default.createElement(P,{label:(0,F.formatMessage)({id:"oal.user-manage.accountName"})},n("userName")(k.default.createElement(i.default,{placeholder:(0,F.formatMessage)({id:"oal.user-manage.enterAccountNameTips"})})))),k.default.createElement(d.default,{xxl:4,lg:4,md:4,sm:24},k.default.createElement("span",{className:R.default.submitButtons},k.default.createElement(o.default,{onClick:e.handleSearch,type:"primary",htmlType:"submit",loading:l},k.default.createElement(F.FormattedMessage,{id:"oal.face.search"})),k.default.createElement(o.default,{style:{marginLeft:8},loading:l,onClick:e.handleFormReset},k.default.createElement(F.FormattedMessage,{id:"oal.common.reset"}))))))},e.handleSelectRows=function(a){e.setState({selectedRows:a})},e.handleStandardTableChange=function(a){e.setState({page:{current:a.current,pageSize:a.pageSize},selectedRows:[]},function(){e.loadUserList()})},e.user_showTotal=function(e,a){return(0,F.formatMessage)({id:"oal.user-manage.currentToTotal"},{total:e})},e}return(0,g.default)(t,[{key:"componentDidMount",value:function(){this.loadUserList()}},{key:"render",value:function(){var e=this,a=this.props,t=a.userManagement.userList,l=a.userListLoading,n=a.addLoading,s=a.modifyLoading,d=a.handleStateLoading,i=a.currentUser,u=a.resetPswLoading;t&&t.pagination&&(t.pagination.showTotal=this.user_showTotal);var m=this.state,c=m.selectedRows,f=m.modalVisible,g=m.selectedUser,p=m.resetVisible,h=m.delVisible;return k.default.createElement(w.PageHeaderWrapper,{className:R.default.myPageHeaderWrapper},k.default.createElement(r.default,{bordered:!1},k.default.createElement("div",{className:R.default.tableList},k.default.createElement("div",{className:R.default.tableListForm},this.renderSimpleForm()),k.default.createElement("div",{className:R.default.tableListOperator},k.default.createElement(o.default,{icon:"plus",type:"primary",onClick:function(){return e.toAdd()}},k.default.createElement(F.FormattedMessage,{id:"oal.face.add"}))),k.default.createElement(C.default,{rowKey:function(e){return e._id},needRowSelection:!1,selectedRows:c,loading:l,data:t,columns:this.columns,onSelectRow:this.handleSelectRows,onChange:this.handleStandardTableChange}))),k.default.createElement(N.default,{confirmLoading:n||s,currentUser:i,visible:f,userBean:g,handleCancel:this.closeAddOrUpdateModal,handleSubmit:this.submitAddOrUpdate}),k.default.createElement(V.default,{visible:p,userBean:g,confirmLoading:u,handleCancel:this.closeResetModal,handleSubmit:this.resetPsw}),k.default.createElement(x.default,{visible:h,userBean:g,confirmLoading:d,handleCancel:this.closeDelModal,handleSubmit:this.deleteUser}))}}]),t}(k.Component),E=L))||E),T=v.default.create()(A);a.default=T},G4ee:function(e,a,t){"use strict";var l=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("2qtc");var n=l(t("kLXV")),r=l(t("q1tI")),s=t("Y2fQ"),o=function(e){var a=e.userBean,t=e.visible,l=e.handleSubmit,o=e.handleCancel,d=e.confirmLoading;return r.default.createElement(n.default,{destroyOnClose:!0,title:(0,s.formatMessage)({id:"oal.user-manage.disableAccount"}),visible:t,onOk:function(){return l(a)},confirmLoading:d,onCancel:o,maskClosable:!1,okText:(0,s.formatMessage)({id:"oal.common.disable"}),okType:"danger",cancelText:(0,s.formatMessage)({id:"oal.common.cancel"})},r.default.createElement("p",null,r.default.createElement(s.FormattedMessage,{id:"oal.user-manage.deleteAccountConfirm"})))},d=o;a.default=d},HGS4:function(e,a,t){"use strict";var l=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("2qtc");var n=l(t("kLXV"));t("y8nQ");var r=l(t("Vl3Y"));t("5NDa");var s=l(t("5rEg")),o=l(t("q1tI")),d=(t("+n12"),t("Y2fQ")),i={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:16}}},u=function(e){var a=e.form,t=e.userBean,l=(e.currentUser,e.visible),u=e.handleSubmit,m=e.confirmLoading,c=e.handleCancel,f=a.getFieldDecorator,g=!(!t||!t._id),p=(0,d.formatMessage)({id:"oal.user-manage.newAccount"});g&&(p=(0,d.formatMessage)({id:"oal.common.modify"}));var h=function(){a.validateFields(function(e,l){if(!e){var n=l;g&&(n.userId=t._id),u(n,function(){a.resetFields()})}})},b=function(e,a,t){var l=/^[\d\*\#\+]{1,14}$/;a&&!l.test(a)&&t((0,d.formatMessage)({id:"oal.common.formatError"})),t()};return o.default.createElement(n.default,{destroyOnClose:!0,title:p,visible:l,onOk:h,confirmLoading:m,onCancel:c,maskClosable:!1},o.default.createElement(r.default,i,o.default.createElement(r.default.Item,{label:(0,d.formatMessage)({id:"oal.user-manage.accountName"})},f("userName",{rules:[{required:!0,message:(0,d.formatMessage)({id:"oal.user-manage.enterAccountNameTips"})},{pattern:/^[a-zA-Z]+$/,message:(0,d.formatMessage)({id:"oal.user-manage.enterUsernameError"})},{max:10,message:(0,d.formatMessage)({id:"oal.common.maxLength"},{num:"10"})}],initialValue:g?t.userName:""})(o.default.createElement(s.default,{placeholder:(0,d.formatMessage)({id:"oal.user-manage.accountName"}),disabled:g}))),o.default.createElement(r.default.Item,{label:(0,d.formatMessage)({id:"oal.common.nickname"})},f("nickName",{rules:[{required:!0,message:(0,d.formatMessage)({id:"oal.user-manage.enterNicknameTips"})},{max:20,message:(0,d.formatMessage)({id:"oal.common.maxLength"},{num:"20"})}],initialValue:g?t.profile&&t.profile.nickName:""})(o.default.createElement(s.default,{placeholder:(0,d.formatMessage)({id:"oal.common.nickname"}),disabled:g}))),o.default.createElement(r.default.Item,{label:(0,d.formatMessage)({id:"oal.common.phoneNumber"})},f("mobile",{rules:[{validator:b}],initialValue:g?t.profile&&t.profile.mobile:""})(o.default.createElement(s.default,{placeholder:(0,d.formatMessage)({id:"oal.common.phoneNumber"})}))),o.default.createElement(r.default.Item,{label:(0,d.formatMessage)({id:"oal.common.emailAddress"})},f("email",{rules:[{type:"email",message:(0,d.formatMessage)({id:"oal.common.formatError"})},{max:80,message:(0,d.formatMessage)({id:"oal.common.maxLength"},{num:"80"})}],initialValue:g?t.profile&&t.profile.email:""})(o.default.createElement(s.default,{placeholder:(0,d.formatMessage)({id:"oal.common.emailAddress"})})))))},m=r.default.create({name:"addOrUpdate"})(u),c=m;a.default=c},TIwi:function(e,a,t){"use strict";var l=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("2qtc");var n=l(t("kLXV")),r=l(t("q1tI")),s=t("Y2fQ"),o=function(e){var a=e.userBean,t=e.visible,l=e.handleSubmit,o=e.handleCancel,d=e.confirmLoading,i=(0,s.formatMessage)({id:"oal.user-manage.resetPassword"});return r.default.createElement(n.default,{destroyOnClose:!0,title:i,visible:t,onOk:function(){return l(a)},onCancel:o,maskClosable:!1,confirmLoading:d,okText:(0,s.formatMessage)({id:"oal.common.reset"}),cancelText:(0,s.formatMessage)({id:"oal.common.cancel"})},r.default.createElement("p",null,r.default.createElement(s.FormattedMessage,{id:"oal.user-manage.resetPasswordConfirm",values:{account:a.userName}})))},d=o;a.default=d}}]);