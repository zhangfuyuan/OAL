(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{JdAL:function(t,e,n){"use strict";var r=n("g09b");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u=r(n("p0pE")),o=r(n("d6i3")),a=n("b9oA"),i=(n("CI8R"),{namespace:"face",state:{faceList:{},sysConfigs:[]},effects:{fetch:o.default.mark(function t(e,n){var r,u,i,c;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,i=n.put,t.next=4,u(a.fetchList,r);case 4:if(c=t.sent,!(c&&c.res>0)){t.next=8;break}return t.next=8,i({type:"save",payload:c.data});case 8:return t.abrupt("return",Promise.resolve(c));case 9:case"end":return t.stop()}},t)}),delete:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,t.next=4,u(a.deleteFace,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),removeAll:o.default.mark(function t(e,n){var r,u;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=n.call,t.next=3,r(a.removeAllFace);case 3:return u=t.sent,t.abrupt("return",Promise.resolve(u));case 5:case"end":return t.stop()}},t)}),modify:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,t.next=4,u(a.modifyFaceInfo,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),fetchGroupTree:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.fetchGroup,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),addGroupNode:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxAddGroupNode,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),modifyGroupNode:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxModifyGroupNode,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),delGroupNode:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxDelGroupNode,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),refreshGroupNum:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxRefreshGroupNum,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),addInfo:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxAddInfo,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),editInfo:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxEditInfo,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),moveFace:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxMoveFace,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),setFaceState:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxSetFaceState,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),getBatchAddTaskId:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxGetBatchAddTaskId,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),getBatchAddTaskProgress:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxGetBatchAddTaskProgress,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)}),cancelBatchAddTask:o.default.mark(function t(e,n){var r,u,i;return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.payload,u=n.call,n.put,n.select,t.next=4,u(a.ajaxCancelBatchAddTask,r);case 4:return i=t.sent,t.abrupt("return",Promise.resolve(i));case 6:case"end":return t.stop()}},t)})},reducers:{save:function(t,e){return(0,u.default)({},t,{faceList:e.payload})},saveSysConfig:function(t,e){return(0,u.default)({},t,{sysConfigs:e.payload})}}}),c=i;e.default=c},"S+eF":function(t,e,n){(function(e){(function(e){"use strict";"function"===typeof bootstrap?bootstrap("promise",e):t.exports=e()})(function(){"use strict";var t=!1;try{throw new Error}catch(e){t=!!e.stack}var n,r=A(),u=function(){},o=function(){var t={task:void 0,next:null},n=t,r=!1,u=void 0,a=!1,i=[];function c(){var e,n;while(t.next)t=t.next,e=t.task,t.task=void 0,n=t.domain,n&&(t.domain=void 0,n.enter()),s(e,n);while(i.length)e=i.pop(),s(e);r=!1}function s(t,e){try{t()}catch(t){if(a)throw e&&e.exit(),setTimeout(c,0),e&&e.enter(),t;setTimeout(function(){throw t},0)}e&&e.exit()}if(o=function(t){n=n.next={task:t,domain:a&&e.domain,next:null},r||(r=!0,u())},"object"===typeof e&&"[object process]"===e.toString()&&e.nextTick)a=!0,u=function(){e.nextTick(c)};else if("function"===typeof setImmediate)u="undefined"!==typeof window?setImmediate.bind(window,c):function(){setImmediate(c)};else if("undefined"!==typeof MessageChannel){var p=new MessageChannel;p.port1.onmessage=function(){u=f,p.port1.onmessage=c,c()};var f=function(){p.port2.postMessage(0)};u=function(){setTimeout(c,0),f()}}else u=function(){setTimeout(c,0)};return o.runAfter=function(t){i.push(t),r||(r=!0,u())},o}(),a=Function.call;function i(t){return function(){return a.apply(t,arguments)}}var c,s=i(Array.prototype.slice),p=i(Array.prototype.reduce||function(t,e){var n=0,r=this.length;if(1===arguments.length)do{if(n in this){e=this[n++];break}if(++n>=r)throw new TypeError}while(1);for(;n<r;n++)n in this&&(e=t(e,this[n],n));return e}),f=i(Array.prototype.indexOf||function(t){for(var e=0;e<this.length;e++)if(this[e]===t)return e;return-1}),l=i(Array.prototype.map||function(t,e){var n=this,r=[];return p(n,function(u,o,a){r.push(t.call(e,o,a,n))},void 0),r}),d=Object.create||function(t){function e(){}return e.prototype=t,new e},h=Object.defineProperty||function(t,e,n){return t[e]=n.value,t},v=i(Object.prototype.hasOwnProperty),y=Object.keys||function(t){var e=[];for(var n in t)v(t,n)&&e.push(n);return e},m=i(Object.prototype.toString);function w(t){return t===Object(t)}function k(t){return"[object StopIteration]"===m(t)||t instanceof c}c="undefined"!==typeof ReturnValue?ReturnValue:function(t){this.value=t};var x="From previous event:";function b(e,n){if(t&&n.stack&&"object"===typeof e&&null!==e&&e.stack){for(var r=[],u=n;u;u=u.source)u.stack&&(!e.__minimumStackCounter__||e.__minimumStackCounter__>u.stackCounter)&&(h(e,"__minimumStackCounter__",{value:u.stackCounter,configurable:!0}),r.unshift(u.stack));r.unshift(e.stack);var o=r.join("\n"+x+"\n"),a=j(o);h(e,"stack",{value:a,configurable:!0})}}function j(t){for(var e=t.split("\n"),n=[],r=0;r<e.length;++r){var u=e[r];P(u)||g(u)||!u||n.push(u)}return n.join("\n")}function g(t){return-1!==t.indexOf("(module.js:")||-1!==t.indexOf("(node.js:")}function T(t){var e=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(t);if(e)return[e[1],Number(e[2])];var n=/at ([^ ]+):(\d+):(?:\d+)$/.exec(t);if(n)return[n[1],Number(n[2])];var r=/.*@(.+):(\d+)$/.exec(t);return r?[r[1],Number(r[2])]:void 0}function P(t){var e=T(t);if(!e)return!1;var u=e[0],o=e[1];return u===n&&o>=r&&o<=pt}function A(){if(t)try{throw new Error}catch(t){var e=t.stack.split("\n"),r=e[0].indexOf("@")>0?e[1]:e[2],u=T(r);if(!u)return;return n=u[0],u[1]}}function R(t,e,n){return function(){return"undefined"!==typeof console&&"function"===typeof console.warn&&console.warn(e+" is deprecated, use "+n+" instead.",new Error("").stack),t.apply(t,arguments)}}function S(t){return t instanceof F?t:D(t)?W(t):K(t)}S.resolve=S,S.nextTick=o,S.longStackSupport=!1;var N=1;function G(){var e,n=[],r=[],u=d(G.prototype),o=d(F.prototype);if(o.promiseDispatch=function(t,u,o){var a=s(arguments);n?(n.push(a),"when"===u&&o[1]&&r.push(o[1])):S.nextTick(function(){e.promiseDispatch.apply(e,a)})},o.valueOf=function(){if(n)return o;var t=_(e);return C(t)&&(e=t),t},o.inspect=function(){return e?e.inspect():{state:"pending"}},S.longStackSupport&&t)try{throw new Error}catch(t){o.stack=t.stack.substring(t.stack.indexOf("\n")+1),o.stackCounter=N++}function a(u){e=u,S.longStackSupport&&t&&(o.source=u),p(n,function(t,e){S.nextTick(function(){u.promiseDispatch.apply(u,e)})},void 0),n=void 0,r=void 0}return u.promise=o,u.resolve=function(t){e||a(S(t))},u.fulfill=function(t){e||a(K(t))},u.reject=function(t){e||a(H(t))},u.notify=function(t){e||p(r,function(e,n){S.nextTick(function(){n(t)})},void 0)},u}function I(t){if("function"!==typeof t)throw new TypeError("resolver must be a function.");var e=G();try{t(e.resolve,e.reject,e.notify)}catch(t){e.reject(t)}return e.promise}function E(t){return I(function(e,n){for(var r=0,u=t.length;r<u;r++)S(t[r]).then(e,n)})}function F(t,e,n){void 0===e&&(e=function(t){return H(new Error("Promise does not support operation: "+t))}),void 0===n&&(n=function(){return{state:"unknown"}});var r=d(F.prototype);if(r.promiseDispatch=function(n,u,o){var a;try{a=t[u]?t[u].apply(r,o):e.call(r,u,o)}catch(t){a=H(t)}n&&n(a)},r.inspect=n,n){var u=n();"rejected"===u.state&&(r.exception=u.reason),r.valueOf=function(){var t=n();return"pending"===t.state||"rejected"===t.state?r:t.value}}return r}function O(t,e,n,r){return S(t).then(e,n,r)}function _(t){if(C(t)){var e=t.inspect();if("fulfilled"===e.state)return e.value}return t}function C(t){return t instanceof F}function D(t){return w(t)&&"function"===typeof t.then}function B(t){return C(t)&&"pending"===t.inspect().state}function M(t){return!C(t)||"fulfilled"===t.inspect().state}function Q(t){return C(t)&&"rejected"===t.inspect().state}"object"===typeof e&&e&&Object({NODE_ENV:"production"})&&Object({NODE_ENV:"production"}).Q_DEBUG&&(S.longStackSupport=!0),S.defer=G,G.prototype.makeNodeResolver=function(){var t=this;return function(e,n){e?t.reject(e):arguments.length>2?t.resolve(s(arguments,1)):t.resolve(n)}},S.Promise=I,S.promise=I,I.race=E,I.all=ut,I.reject=H,I.resolve=S,S.passByCopy=function(t){return t},F.prototype.passByCopy=function(){return this},S.join=function(t,e){return S(t).join(e)},F.prototype.join=function(t){return S([this,t]).spread(function(t,e){if(t===e)return t;throw new Error("Q can't join: not the same: "+t+" "+e)})},S.race=E,F.prototype.race=function(){return this.then(S.race)},S.makePromise=F,F.prototype.toString=function(){return"[object Promise]"},F.prototype.then=function(t,e,n){var r=this,u=G(),o=!1;function a(e){try{return"function"===typeof t?t(e):e}catch(t){return H(t)}}function i(t){if("function"===typeof e){b(t,r);try{return e(t)}catch(t){return H(t)}}return H(t)}function c(t){return"function"===typeof n?n(t):t}return S.nextTick(function(){r.promiseDispatch(function(t){o||(o=!0,u.resolve(a(t)))},"when",[function(t){o||(o=!0,u.resolve(i(t)))}])}),r.promiseDispatch(void 0,"when",[void 0,function(t){var e,n=!1;try{e=c(t)}catch(t){if(n=!0,!S.onerror)throw t;S.onerror(t)}n||u.notify(e)}]),u.promise},S.tap=function(t,e){return S(t).tap(e)},F.prototype.tap=function(t){return t=S(t),this.then(function(e){return t.fcall(e).thenResolve(e)})},S.when=O,F.prototype.thenResolve=function(t){return this.then(function(){return t})},S.thenResolve=function(t,e){return S(t).thenResolve(e)},F.prototype.thenReject=function(t){return this.then(function(){throw t})},S.thenReject=function(t,e){return S(t).thenReject(e)},S.nearer=_,S.isPromise=C,S.isPromiseAlike=D,S.isPending=B,F.prototype.isPending=function(){return"pending"===this.inspect().state},S.isFulfilled=M,F.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},S.isRejected=Q,F.prototype.isRejected=function(){return"rejected"===this.inspect().state};var L=[],U=[],V=[],J=!0;function $(){L.length=0,U.length=0,J||(J=!0)}function q(t,n){J&&("object"===typeof e&&"function"===typeof e.emit&&S.nextTick.runAfter(function(){-1!==f(U,t)&&(e.emit("unhandledRejection",n,t),V.push(t))}),U.push(t),n&&"undefined"!==typeof n.stack?L.push(n.stack):L.push("(no stack) "+n))}function z(t){if(J){var n=f(U,t);-1!==n&&("object"===typeof e&&"function"===typeof e.emit&&S.nextTick.runAfter(function(){var r=f(V,t);-1!==r&&(e.emit("rejectionHandled",L[n],t),V.splice(r,1))}),U.splice(n,1),L.splice(n,1))}}function H(t){var e=F({when:function(e){return e&&z(this),e?e(t):this}},function(){return this},function(){return{state:"rejected",reason:t}});return q(e,t),e}function K(t){return F({when:function(){return t},get:function(e){return t[e]},set:function(e,n){t[e]=n},delete:function(e){delete t[e]},post:function(e,n){return null===e||void 0===e?t.apply(void 0,n):t[e].apply(t,n)},apply:function(e,n){return t.apply(e,n)},keys:function(){return y(t)}},void 0,function(){return{state:"fulfilled",value:t}})}function W(t){var e=G();return S.nextTick(function(){try{t.then(e.resolve,e.reject,e.notify)}catch(t){e.reject(t)}}),e.promise}function X(t){return F({isDef:function(){}},function(e,n){return rt(t,e,n)},function(){return S(t).inspect()})}function Y(t,e,n){return S(t).spread(e,n)}function Z(t){return function(){function e(t,e){var o;if("undefined"===typeof StopIteration){try{o=n[t](e)}catch(t){return H(t)}return o.done?S(o.value):O(o.value,r,u)}try{o=n[t](e)}catch(t){return k(t)?S(t.value):H(t)}return O(o,r,u)}var n=t.apply(this,arguments),r=e.bind(e,"next"),u=e.bind(e,"throw");return r()}}function tt(t){S.done(S.async(t)())}function et(t){throw new c(t)}function nt(t){return function(){return Y([this,ut(arguments)],function(e,n){return t.apply(e,n)})}}function rt(t,e,n){return S(t).dispatch(e,n)}function ut(t){return O(t,function(t){var e=0,n=G();return p(t,function(r,u,o){var a;C(u)&&"fulfilled"===(a=u.inspect()).state?t[o]=a.value:(++e,O(u,function(r){t[o]=r,0===--e&&n.resolve(t)},n.reject,function(t){n.notify({index:o,value:t})}))},void 0),0===e&&n.resolve(t),n.promise})}function ot(t){if(0===t.length)return S.resolve();var e=S.defer(),n=0;return p(t,function(r,u,o){var a=t[o];function i(t){e.resolve(t)}function c(t){if(n--,0===n){var r=t||new Error(""+t);r.message="Q can't get fulfillment value from any promise, all promises were rejected. Last error message: "+r.message,e.reject(r)}}function s(t){e.notify({index:o,value:t})}n++,O(a,i,c,s)},void 0),e.promise}function at(t){return O(t,function(t){return t=l(t,S),O(ut(l(t,function(t){return O(t,u,u)})),function(){return t})})}function it(t){return S(t).allSettled()}function ct(t,e){return S(t).then(void 0,void 0,e)}function st(t,e){return S(t).nodeify(e)}S.resetUnhandledRejections=$,S.getUnhandledReasons=function(){return L.slice()},S.stopUnhandledRejectionTracking=function(){$(),J=!1},$(),S.reject=H,S.fulfill=K,S.master=X,S.spread=Y,F.prototype.spread=function(t,e){return this.all().then(function(e){return t.apply(void 0,e)},e)},S.async=Z,S.spawn=tt,S["return"]=et,S.promised=nt,S.dispatch=rt,F.prototype.dispatch=function(t,e){var n=this,r=G();return S.nextTick(function(){n.promiseDispatch(r.resolve,t,e)}),r.promise},S.get=function(t,e){return S(t).dispatch("get",[e])},F.prototype.get=function(t){return this.dispatch("get",[t])},S.set=function(t,e,n){return S(t).dispatch("set",[e,n])},F.prototype.set=function(t,e){return this.dispatch("set",[t,e])},S.del=S["delete"]=function(t,e){return S(t).dispatch("delete",[e])},F.prototype.del=F.prototype["delete"]=function(t){return this.dispatch("delete",[t])},S.mapply=S.post=function(t,e,n){return S(t).dispatch("post",[e,n])},F.prototype.mapply=F.prototype.post=function(t,e){return this.dispatch("post",[t,e])},S.send=S.mcall=S.invoke=function(t,e){return S(t).dispatch("post",[e,s(arguments,2)])},F.prototype.send=F.prototype.mcall=F.prototype.invoke=function(t){return this.dispatch("post",[t,s(arguments,1)])},S.fapply=function(t,e){return S(t).dispatch("apply",[void 0,e])},F.prototype.fapply=function(t){return this.dispatch("apply",[void 0,t])},S["try"]=S.fcall=function(t){return S(t).dispatch("apply",[void 0,s(arguments,1)])},F.prototype.fcall=function(){return this.dispatch("apply",[void 0,s(arguments)])},S.fbind=function(t){var e=S(t),n=s(arguments,1);return function(){return e.dispatch("apply",[this,n.concat(s(arguments))])}},F.prototype.fbind=function(){var t=this,e=s(arguments);return function(){return t.dispatch("apply",[this,e.concat(s(arguments))])}},S.keys=function(t){return S(t).dispatch("keys",[])},F.prototype.keys=function(){return this.dispatch("keys",[])},S.all=ut,F.prototype.all=function(){return ut(this)},S.any=ot,F.prototype.any=function(){return ot(this)},S.allResolved=R(at,"allResolved","allSettled"),F.prototype.allResolved=function(){return at(this)},S.allSettled=it,F.prototype.allSettled=function(){return this.then(function(t){return ut(l(t,function(t){function e(){return t.inspect()}return t=S(t),t.then(e,e)}))})},S.fail=S["catch"]=function(t,e){return S(t).then(void 0,e)},F.prototype.fail=F.prototype["catch"]=function(t){return this.then(void 0,t)},S.progress=ct,F.prototype.progress=function(t){return this.then(void 0,void 0,t)},S.fin=S["finally"]=function(t,e){return S(t)["finally"](e)},F.prototype.fin=F.prototype["finally"]=function(t){if(!t||"function"!==typeof t.apply)throw new Error("Q can't apply finally callback");return t=S(t),this.then(function(e){return t.fcall().then(function(){return e})},function(e){return t.fcall().then(function(){throw e})})},S.done=function(t,e,n,r){return S(t).done(e,n,r)},F.prototype.done=function(t,n,r){var u=function(t){S.nextTick(function(){if(b(t,o),!S.onerror)throw t;S.onerror(t)})},o=t||n||r?this.then(t,n,r):this;"object"===typeof e&&e&&e.domain&&(u=e.domain.bind(u)),o.then(void 0,u)},S.timeout=function(t,e,n){return S(t).timeout(e,n)},F.prototype.timeout=function(t,e){var n=G(),r=setTimeout(function(){e&&"string"!==typeof e||(e=new Error(e||"Timed out after "+t+" ms"),e.code="ETIMEDOUT"),n.reject(e)},t);return this.then(function(t){clearTimeout(r),n.resolve(t)},function(t){clearTimeout(r),n.reject(t)},n.notify),n.promise},S.delay=function(t,e){return void 0===e&&(e=t,t=void 0),S(t).delay(e)},F.prototype.delay=function(t){return this.then(function(e){var n=G();return setTimeout(function(){n.resolve(e)},t),n.promise})},S.nfapply=function(t,e){return S(t).nfapply(e)},F.prototype.nfapply=function(t){var e=G(),n=s(t);return n.push(e.makeNodeResolver()),this.fapply(n).fail(e.reject),e.promise},S.nfcall=function(t){var e=s(arguments,1);return S(t).nfapply(e)},F.prototype.nfcall=function(){var t=s(arguments),e=G();return t.push(e.makeNodeResolver()),this.fapply(t).fail(e.reject),e.promise},S.nfbind=S.denodeify=function(t){if(void 0===t)throw new Error("Q can't wrap an undefined function");var e=s(arguments,1);return function(){var n=e.concat(s(arguments)),r=G();return n.push(r.makeNodeResolver()),S(t).fapply(n).fail(r.reject),r.promise}},F.prototype.nfbind=F.prototype.denodeify=function(){var t=s(arguments);return t.unshift(this),S.denodeify.apply(void 0,t)},S.nbind=function(t,e){var n=s(arguments,2);return function(){var r=n.concat(s(arguments)),u=G();function o(){return t.apply(e,arguments)}return r.push(u.makeNodeResolver()),S(o).fapply(r).fail(u.reject),u.promise}},F.prototype.nbind=function(){var t=s(arguments,0);return t.unshift(this),S.nbind.apply(void 0,t)},S.nmapply=S.npost=function(t,e,n){return S(t).npost(e,n)},F.prototype.nmapply=F.prototype.npost=function(t,e){var n=s(e||[]),r=G();return n.push(r.makeNodeResolver()),this.dispatch("post",[t,n]).fail(r.reject),r.promise},S.nsend=S.nmcall=S.ninvoke=function(t,e){var n=s(arguments,2),r=G();return n.push(r.makeNodeResolver()),S(t).dispatch("post",[e,n]).fail(r.reject),r.promise},F.prototype.nsend=F.prototype.nmcall=F.prototype.ninvoke=function(t){var e=s(arguments,1),n=G();return e.push(n.makeNodeResolver()),this.dispatch("post",[t,e]).fail(n.reject),n.promise},S.nodeify=st,F.prototype.nodeify=function(t){if(!t)return this;this.then(function(e){S.nextTick(function(){t(null,e)})},function(e){S.nextTick(function(){t(e)})})},S.noConflict=function(){throw new Error("Q.noConflict only works when Q is used as a global")};var pt=A();return S})}).call(this,n("Q2Ig"))},b9oA:function(t,e,n){"use strict";var r=n("g09b");Object.defineProperty(e,"__esModule",{value:!0}),e.fetchGroup=i,e.ajaxAddGroupNode=s,e.ajaxModifyGroupNode=f,e.ajaxDelGroupNode=d,e.ajaxRefreshGroupNum=v,e.fetchList=m,e.ajaxSetFaceState=k,e.ajaxAddInfo=b,e.ajaxEditInfo=g,e.ajaxGetBatchAddTaskId=P,e.ajaxGetBatchAddTaskProgress=R,e.ajaxCancelBatchAddTask=N,e.ajaxMoveFace=I,e.deleteFace=F,e.removeAllFace=_,e.renameFace=D,e.modifyFaceInfo=M;var u=r(n("d6i3")),o=r(n("1l/V")),a=n("qz5Q");n("S+eF");function i(t){return c.apply(this,arguments)}function c(){return c=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/group/fetchGroupAllTree",e));case 1:case"end":return t.stop()}},t)})),c.apply(this,arguments)}function s(t){return p.apply(this,arguments)}function p(){return p=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/group/saveGroup",e));case 1:case"end":return t.stop()}},t)})),p.apply(this,arguments)}function f(t){return l.apply(this,arguments)}function l(){return l=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/group/saveGroup",e));case 1:case"end":return t.stop()}},t)})),l.apply(this,arguments)}function d(t){return h.apply(this,arguments)}function h(){return h=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/group/deleteGroup",e));case 1:case"end":return t.stop()}},t)})),h.apply(this,arguments)}function v(t){return y.apply(this,arguments)}function y(){return y=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/group/updateFaceNum",e));case 1:case"end":return t.stop()}},t)})),y.apply(this,arguments)}function m(t){return w.apply(this,arguments)}function w(){return w=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/face/fetchList",e));case 1:case"end":return t.stop()}},t)})),w.apply(this,arguments)}function k(t){return x.apply(this,arguments)}function x(){return x=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/face/setState",e));case 1:case"end":return t.stop()}},t)})),x.apply(this,arguments)}function b(t){return j.apply(this,arguments)}function j(){return j=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/face/addFaceInfo",e));case 1:case"end":return t.stop()}},t)})),j.apply(this,arguments)}function g(t){return T.apply(this,arguments)}function T(){return T=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/face/saveFaceInfo",e));case 1:case"end":return t.stop()}},t)})),T.apply(this,arguments)}function P(t){return A.apply(this,arguments)}function A(){return A=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/system/createTask",e));case 1:case"end":return t.stop()}},t)})),A.apply(this,arguments)}function R(t){return S.apply(this,arguments)}function S(){return S=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/system/taskProgress",e));case 1:case"end":return t.stop()}},t)})),S.apply(this,arguments)}function N(t){return G.apply(this,arguments)}function G(){return G=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/system/removeTask",e));case 1:case"end":return t.stop()}},t)})),G.apply(this,arguments)}function I(t){return E.apply(this,arguments)}function E(){return E=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/guard-web/a/face/moveFace",e));case 1:case"end":return t.stop()}},t)})),E.apply(this,arguments)}function F(t){return O.apply(this,arguments)}function O(){return O=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.get)("/api/face/manage/".concat(e.faceId,"/remove")));case 1:case"end":return t.stop()}},t)})),O.apply(this,arguments)}function _(){return C.apply(this,arguments)}function C(){return C=(0,o.default)(u.default.mark(function t(){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.remove)("/api/face/manage/removeAll"));case 1:case"end":return t.stop()}},t)})),C.apply(this,arguments)}function D(t){return B.apply(this,arguments)}function B(){return B=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.get)("/api/face/manage/".concat(e.faceId,"/rename/").concat(e.name)));case 1:case"end":return t.stop()}},t)})),B.apply(this,arguments)}function M(t){return Q.apply(this,arguments)}function Q(){return Q=(0,o.default)(u.default.mark(function t(e){return u.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,a.post)("/api/face/manage/".concat(e.faceId,"/modify"),e));case 1:case"end":return t.stop()}},t)})),Q.apply(this,arguments)}}}]);