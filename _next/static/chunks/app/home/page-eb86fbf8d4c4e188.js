(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[951],{8377:function(e,r,t){Promise.resolve().then(t.t.bind(t,1749,23)),Promise.resolve().then(t.t.bind(t,5250,23)),Promise.resolve().then(t.t.bind(t,1603,23)),Promise.resolve().then(t.bind(t,9705)),Promise.resolve().then(t.bind(t,4264)),Promise.resolve().then(t.bind(t,1071)),Promise.resolve().then(t.bind(t,5530)),Promise.resolve().then(t.bind(t,4650)),Promise.resolve().then(t.bind(t,5215)),Promise.resolve().then(t.bind(t,2804)),Promise.resolve().then(t.bind(t,4768)),Promise.resolve().then(t.t.bind(t,1309,23)),Promise.resolve().then(t.t.bind(t,9432,23)),Promise.resolve().then(t.t.bind(t,3991,23)),Promise.resolve().then(t.t.bind(t,2425,23)),Promise.resolve().then(t.t.bind(t,4749,23)),Promise.resolve().then(t.t.bind(t,7913,23)),Promise.resolve().then(t.t.bind(t,6157,23)),Promise.resolve().then(t.t.bind(t,7357,23))},4768:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return m}});var n=t(7437),i=t(1396),l=t.n(i);t(7323);var s=t(1536),o=t(2265);t(2887);var a=t(4940),u=t(7880);let d=(0,o.forwardRef)((e,r)=>{let{labelText:t,datalist:i,name:l,id:s,inputType:d="text",required:c,valueType:h="skip",placeholder:v,description:m,describedBy:b}=e;(0,o.useImperativeHandle)(r,()=>({getValue(){var e;return null===(e=A.current)||void 0===e?void 0:e.value},setValue(e){A.current&&(A.current.value=e)},getError(){var e;if(!A.current)return{name:"System Error",errorText:"Error while checking errors. Please, contact us"};let r=g(null==A?void 0:null===(e=A.current)||void 0===e?void 0:e.value);return null===r?null:{errorText:r,name:l}}}));let[f,p]=(0,o.useState)(null),A=(0,o.useRef)(null),g=e=>{let r=(0,u.Ts)({value:e,valueType:h});return p(r),r};return(0,n.jsxs)("div",{className:"block_input ".concat(f?"incorrect-value":""),"data-selector":"input-block",children:[t&&(0,n.jsxs)("label",{htmlFor:s,children:[t,c&&(0,n.jsx)("span",{"aria-label":"This is required field",children:" *"})]}),(0,n.jsxs)("div",{className:"input-wrapper",children:[(0,n.jsx)("input",{ref:A,"data-selector":"input",...m?{"aria-label":m}:{},...b?{"aria-describedby":b}:{},...f?{"aria-describedby":"".concat(s,"_error")}:{},className:"input-element",id:s,type:d,onChange:()=>{p(null)},onBlur:e=>{g(e.target.value)},...i?{list:"".concat(s,"-datalist")}:{},onKeyPress:e=>{"Enter"===e.code&&e.preventDefault()},...v?{placeholder:v}:{}}),i&&i.length>0&&(0,n.jsx)("datalist",{id:"".concat(s,"-datalist"),children:i.map(e=>(0,n.jsx)("option",{value:e},e))}),(0,a.k)(f?"show":"").iconExclamation]}),f&&(0,n.jsx)("span",{id:"".concat(s,"_error"),"aria-description":"Error in this input","data-content":"errorText",children:"".concat(f)})]})});d.displayName="Input";var c=t(7020);t(2670);var h=e=>{let{header:r,texts:t,button:i,status:l,onClick:s}=e;return(0,n.jsxs)("div",{className:"modal-message modal-message_".concat(l),children:[(0,n.jsx)("h2",{children:r}),t.map((e,r)=>(0,n.jsx)("p",{children:e},r)),(0,n.jsx)("button",{className:"button_square",onClick:s,children:i})]})};t(2720);var v=()=>(0,n.jsxs)("div",{className:"preloader",title:"Please wait","aria-label":"Please wait",children:[(0,n.jsx)("div",{className:"dash dash_1"}),(0,n.jsx)("div",{className:"dash dash_2"}),(0,n.jsx)("div",{className:"dash dash_3"}),(0,n.jsx)("div",{className:"dash dash_4"})]}),m=()=>{let{modal:e}=(0,c.b)(),r=(0,o.useRef)(null),[t,i]=(0,o.useState)(!1);(0,o.useEffect)(()=>{var r,i;t?null==e||null===(r=e.current)||void 0===r||r.openModal({name:"sendingPreloader",onClose:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()},closable:!1,children:(0,n.jsx)(v,{})}):null==e||null===(i=e.current)||void 0===i||i.closeName("sendingPreloader")},[t]);let a=async t=>{var l,o,a,u,d;t.preventDefault();let c=[r].map(e=>{var r,t;return null===(t=e.current)||void 0===t?void 0:null===(r=t.getError())||void 0===r?void 0:r.errorText}).filter(e=>e);if(c.length>0){null==e||null===(o=e.current)||void 0===o||o.openModal({name:"error",onClose:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()},children:(0,n.jsx)(h,{texts:c,button:"OK",header:"Errors found:",status:"error",onClick:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()}})});return}let v=null===(l=r.current)||void 0===l?void 0:l.getValue();i(!0);try{let t=await fetch(s.E7.sendEmail.url,{method:s.E7.sendEmail.method,headers:{"Content-Type":"application/json"},body:JSON.stringify({email:v})});if(!t.ok){let r=await t.json();null==e||null===(u=e.current)||void 0===u||u.openModal({name:"error",onClose:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()},children:(0,n.jsx)(h,{texts:[r.message],button:"OK",header:"Errors occured:",status:"error",onClick:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()}})}),i(!1);return}null==e||null===(a=e.current)||void 0===a||a.openModal({name:"success",onClose:()=>{var t,n;null===(t=e.current)||void 0===t||t.closeCurrent(),null===(n=r.current)||void 0===n||n.setValue("")},children:(0,n.jsx)(h,{texts:["Your email has been sent"],button:"Close",header:"Success",status:"success",onClick:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()}})})}catch(t){let r=t instanceof Error?t.message:String(t);null==e||null===(d=e.current)||void 0===d||d.openModal({name:"error",onClose:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()},children:(0,n.jsx)(h,{texts:[r],button:"OK",header:"Errors occured:",status:"error",onClick:()=>{var r;return null===(r=e.current)||void 0===r?void 0:r.closeCurrent()}})})}i(!1)};return(0,n.jsxs)("div",{className:"block_info-create-events",children:[(0,n.jsx)("h2",{children:"Create events in minutes"}),(0,n.jsxs)("form",{onSubmit:a,children:[(0,n.jsx)(d,{ref:r,name:"email",valueType:"email",id:"email",placeholder:"Your email",description:"Enter your email to subscribe"}),(0,n.jsx)("button",{className:"button_square",type:"submit",disabled:t,children:"Start"})]}),(0,n.jsxs)("p",{children:["By signing up, you agree to the ",(0,n.jsx)(l(),{href:s.Lf,children:"Terms"})," and ",(0,n.jsx)(l(),{href:s.Kh,children:"Privacy Policy"}),"."]})]})}},1603:function(){},9432:function(){},7323:function(){},6157:function(){},3991:function(){},2670:function(){},2887:function(){},2720:function(){},4749:function(){},7357:function(){},1309:function(){},2425:function(){},7913:function(){},4264:function(e,r,t){"use strict";t.r(r),r.default={src:"./_next/static/media/demo.303d44a5.webp",height:595,width:625,blurDataURL:"data:image/webp;base64,UklGRrQAAABXRUJQVlA4WAoAAAAQAAAABwAABwAAQUxQSEEAAAAABC9qIwAgAABl/f94UP+pLlv//7O4//9tJvP/8vX/6RwH1P/9/P+rAACu///9/1gAAG3zzv/vEgAABhUDRU4AAQBWUDggTAAAANABAJ0BKggACAACQDglpAAQ8AsQRKqgAP7YRJXz8rwxptu7Yjy2im+lVh+BMiTci/zX8U7/Uqvty8zYwk2//Zn4/Dpj/rAyvB8wAAA=",blurWidth:8,blurHeight:8}},1071:function(e,r,t){"use strict";t.r(r),r.default={src:"./_next/static/media/ic_app_logo.3dad96af.svg",height:1024,width:744,blurWidth:0,blurHeight:0}},5530:function(e,r,t){"use strict";t.r(r),r.default={src:"./_next/static/media/on_boarding_1.4df80517.svg",height:299,width:515,blurWidth:0,blurHeight:0}},4650:function(e,r,t){"use strict";t.r(r),r.default={src:"./_next/static/media/on_boarding_2.d7757d19.svg",height:299,width:515,blurWidth:0,blurHeight:0}},5215:function(e,r,t){"use strict";t.r(r),r.default={src:"./_next/static/media/on_boarding_3.99695f4b.svg",height:299,width:515,blurWidth:0,blurHeight:0}},1396:function(e,r,t){e.exports=t(5250)}},function(e){e.O(0,[672,749,909,971,938,744],function(){return e(e.s=8377)}),_N_E=e.O()}]);