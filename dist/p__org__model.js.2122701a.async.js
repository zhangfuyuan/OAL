(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{GNos:function(e,t,r){"use strict";var a=r("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(r("p0pE")),u=a(r("d6i3")),s=r("mVkg"),c={namespace:"org",state:{orgList:{}},effects:{fetch:u.default.mark(function e(t,r){var a,n,c,i;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,c=r.put,e.next=4,n(s.getOrg,a);case 4:if(i=e.sent,!(i&&i.res>0)){e.next=8;break}return e.next=8,c({type:"save",payload:i.data});case 8:return e.abrupt("return",Promise.resolve(i));case 9:case"end":return e.stop()}},e)}),add:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,e.next=4,n(s.add,a);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)}),update:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,e.next=4,n(s.modifyOrg,a);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)}),handleState:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,e.next=4,n(s.handleState,a);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)}),resetPsw:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,e.next=4,n(s.resetPsw,a);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)}),assign:u.default.mark(function e(t,r){var a,n,c;return u.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=t.payload,n=r.call,r.put,e.next=4,n(s.ajaxAssign,a);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)})},reducers:{save:function(e,t){return(0,n.default)({},e,{orgList:t.payload})}}},i=c;t.default=i},mVkg:function(e,t,r){"use strict";var a=r("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.getOrg=c,t.add=p,t.modifyOrg=f,t.resetPsw=d,t.handleState=h,t.ajaxAssign=y;var n=a(r("d6i3")),u=a(r("1l/V")),s=r("qz5Q");function c(e){return i.apply(this,arguments)}function i(){return i=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/sys/office/fetchList",t));case 1:case"end":return e.stop()}},e)})),i.apply(this,arguments)}function p(e){return o.apply(this,arguments)}function o(){return o=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/system/saveOffice",t));case 1:case"end":return e.stop()}},e)})),o.apply(this,arguments)}function f(e){return l.apply(this,arguments)}function l(){return l=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/system/saveOffice",t));case 1:case"end":return e.stop()}},e)})),l.apply(this,arguments)}function d(e){return w.apply(this,arguments)}function w(){return w=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/sys/office/resetPassword",t));case 1:case"end":return e.stop()}},e)})),w.apply(this,arguments)}function h(e){return v.apply(this,arguments)}function v(){return v=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/sys/office/disableEnableOffice",t));case 1:case"end":return e.stop()}},e)})),v.apply(this,arguments)}function y(e){return b.apply(this,arguments)}function b(){return b=(0,u.default)(n.default.mark(function e(t){return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/authorize/assignCreditsByOrg",t));case 1:case"end":return e.stop()}},e)})),b.apply(this,arguments)}}}]);