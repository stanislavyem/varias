(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[554],{6966:function(e,t,n){Promise.resolve().then(n.t.bind(n,6870,23)),Promise.resolve().then(n.bind(n,3804))},7447:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{unstable_getImgProps:function(){return c},default:function(){return l}});let r=n(1024),o=n(8630),i=n(6184),s=n(1749),a=r._(n(536)),c=e=>{(0,i.warnOnce)("Warning: unstable_getImgProps() is experimental and may change or be removed at any time. Use at your own risk.");let{props:t}=(0,o.getImgProps)(e,{defaultLoader:a.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,n]of Object.entries(t))void 0===n&&delete t[e];return{props:t}},l=s.Image},6993:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RouterContext",{enumerable:!0,get:function(){return r}});let r=n(1024)._(n(2265)).default.createContext(null)},3804:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return u}});var r=n(7437),o=n(7020);n(7250),n(2265),n(9432);var i=n(6691),s=n.n(i),a=e=>{let{children:t,img:n}=e;return(0,r.jsxs)("div",{className:"block_info img_".concat("r"===n.pos[0]?"right":"left"," img_").concat("t"===n.pos[1]?"top":"bottom"),children:[(0,r.jsx)("div",{className:"block_info__data",children:t}),(0,r.jsx)("div",{className:"block_info__image",children:(0,r.jsx)("div",{className:"img-wrapper",children:(0,r.jsx)(s(),{src:n.src,alt:n.alt,width:100,height:100})})})]})},c={src:"./_next/static/media/mark_calendar.f3bdce35.svg",height:781,width:972,blurWidth:0,blurHeight:0};n(3991);var l=e=>{let{header:t,text:n}=e;return(0,r.jsxs)("div",{className:"block_info-text",children:[t&&(0,r.jsx)("h2",{children:t}),n.map((e,t)=>(0,r.jsx)("p",{children:e},t))]})},u=()=>{let{lang:e}=(0,o.b)();return(0,r.jsx)("section",{className:"section_about section_text",children:(0,r.jsx)("div",{className:"section__content",children:(0,r.jsxs)("div",{className:"container_page container_content",children:[(0,r.jsx)("h1",{children:"en"===e?"About Datemarks":"FR About Us"}),(0,r.jsx)(a,{img:{src:c,alt:"Two people use their smartphones for social interaction",pos:"rt"},children:(0,r.jsx)(l,{text:["Datemarks is your go-to event-based app designed to seamlessly connect people through shared experiences. Discover and create meaningful events, effortlessly bringing individuals together for memorable moments. Whether it's social gatherings, meetups, or special occasions, Datemarks fosters connections and enriches lives, making every event a chance to create lasting memories.","Datemarks is a dynamic platform, managed by an independent subsidiary of private company. Our team is fuelled by passion, dedicated to our craft, and collectively excited about exploring new horizons alongside our users."]})})]})})})}},7020:function(e,t,n){"use strict";n.d(t,{b:function(){return i}});var r=n(2265),o=n(66);let i=()=>{let e=(0,r.useContext)(o.AppContext);if(!e)throw Error("State is undefined in useAppContext");return e}},66:function(e,t,n){"use strict";n.r(t),n.d(t,{AppContext:function(){return i},Context:function(){return s}});var r=n(7437),o=n(2265);let i=(0,o.createContext)(void 0),s=e=>{var t;let{children:s}=e,[a,c]=(0,o.useState)(),[l,u]=(0,o.useState)((null===(t=n.g.window)||void 0===t?void 0:t.localStorage.getItem("theme"))||"light"),[d,f]=(0,o.useState)("en"),[m,p]=(0,o.useState)(!1),g=async()=>{let e=await localStorage.getItem("lang")||"en";p(!0),f(e)};return(0,o.useEffect)(()=>{g()},[]),(0,o.useEffect)(()=>{document.body.classList.toggle("dark","dark"===l),localStorage.setItem("theme",l)},[l]),(0,o.useEffect)(()=>{var e;m&&(localStorage.setItem("lang",d),null===(e=document.querySelector("html"))||void 0===e||e.setAttribute("lang",d))},[d]),(0,r.jsx)(i.Provider,{value:{theme:l,setTheme:u,lang:d,setLang:f,modal:a,setModal:c},children:s})}},6870:function(){},9432:function(){},3991:function(){},7250:function(){},622:function(e,t,n){"use strict";var r=n(2265),o=Symbol.for("react.element"),i=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,a=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function l(e,t,n){var r,i={},l=null,u=null;for(r in void 0!==n&&(l=""+n),void 0!==t.key&&(l=""+t.key),void 0!==t.ref&&(u=t.ref),t)s.call(t,r)&&!c.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===i[r]&&(i[r]=t[r]);return{$$typeof:o,type:e,key:l,ref:u,props:i,_owner:a.current}}t.Fragment=i,t.jsx=l,t.jsxs=l},7437:function(e,t,n){"use strict";e.exports=n(622)},6691:function(e,t,n){e.exports=n(7447)}},function(e){e.O(0,[749,971,938,744],function(){return e(e.s=6966)}),_N_E=e.O()}]);