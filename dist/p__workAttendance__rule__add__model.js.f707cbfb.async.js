(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{WsFY:function(e,t,n){"use strict";var r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.ajaxAddRule=c,t.addRule=i;var a=r(n("d6i3")),u=r(n("1l/V")),s=n("qz5Q");function c(e){return d.apply(this,arguments)}function d(){return d=(0,u.default)(a.default.mark(function e(t){return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.post)("/guard-web/a/attendance/saveAttendanceRules",t));case 1:case"end":return e.stop()}},e)})),d.apply(this,arguments)}function i(e){return l.apply(this,arguments)}function l(){return l=(0,u.default)(a.default.mark(function e(t){return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.get)("/api/user/authByToken"));case 1:case"end":return e.stop()}},e)})),l.apply(this,arguments)}},"n/9R":function(e,t,n){"use strict";var r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r(n("d6i3")),u=n("WsFY"),s={namespace:"workAttendanceRuleAdd",state:{},effects:{add:a.default.mark(function e(t,n){var r,s,c;return a.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.payload,s=n.call,n.put,n.select,e.next=4,s(u.ajaxAddRule,r);case 4:return c=e.sent,e.abrupt("return",Promise.resolve(c));case 6:case"end":return e.stop()}},e)})},reducers:{}},c=s;t.default=c}}]);