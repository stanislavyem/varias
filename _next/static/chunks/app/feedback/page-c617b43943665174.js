(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[525],{3629:function(e,t,r){Promise.resolve().then(r.bind(r,9912))},9912:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return n}});var o=r(7437);r(3834),r(3971);var a=r(7201),s=r(1443);let i={title:"Send Feedback to the Team",completedHtml:"<h3>Thank you for your feedback</h3>",pages:[{elements:[{name:"email",title:"Enter your email:",type:"text"},{name:"firstName",title:"Enter your first name:",type:"text"},{type:"matrix",name:"qualities",title:"Please indicate if you agree or disagree with the following statements",columns:[{value:5,text:"Strongly agree"},{value:4,text:"Agree"},{value:3,text:"Neutral"},{value:2,text:"Disagree"},{value:1,text:"Strongly disagree"}],rows:[{value:"affordable",text:"Product is affordable"},{value:"does-what-it-claims",text:"Product does what it claims"},{value:"better-than-others",text:"Product is better than other products on the market"},{value:"easy-to-use",text:"Product is easy to use"}]},{type:"rating",name:"satisfaction-score",title:"How satisfied are you with our product?",mininumRateDescription:"Not satisfied",maximumRateDescription:"Completely satisfied"},{type:"rating",name:"recommend",visibleIf:"{satisfaction-score} > 3",title:"How likely are you to recommend our product to a friend or co-worker?",mininumRateDescription:"Will not recommend",maximumRateDescription:"I will recommend"},{type:"comment",name:"suggestions",title:"What would make you more satisfied with our product?"}]},{elements:[{type:"radiogroup",name:"price-comparison",title:"Compared to our competitors, do you feel our product is:",choices:["Less expensive","Priced about the same","More expensive","Not sure"]},{type:"radiogroup",name:"current-price",title:"Do you feel our current price is merited by our product?",choices:["correct|Yes, the price is about right","low|No, the price is too low for your product","high|No, the price is too high for your product"]},{type:"multipletext",name:"price-limits",title:"What is the highest and lowest price you would pay for a product like ours?",items:[{name:"highest",title:"Highest"},{name:"lowest",title:"Lowest"}]}]},{elements:[{type:"text",name:"email",title:"Please leave your email address if you would like us to contact you."}]}],completeText:"Send",widthMode:"responsive",showQuestionNumbers:!1},l={backgroundImage:"",backgroundImageFit:"cover",backgroundImageAttachment:"scroll",backgroundOpacity:1,header:{height:80,inheritWidthFrom:"container",textAreaWidth:512,overlapEnabled:!1,backgroundImageOpacity:1,backgroundImageFit:"cover",logoPositionX:"right",logoPositionY:"top",titlePositionX:"left",titlePositionY:"bottom",descriptionPositionX:"left",descriptionPositionY:"bottom"},themeName:"custom",isPanelless:!0,colorPalette:"light",cssVariables:{"--primary":"rgba(14, 112, 64, 1)","--sjs-general-backcolor":"rgba(255, 255, 255, 1)","--sjs-general-backcolor-dark":"rgba(248, 248, 248, 1)","--sjs-general-backcolor-dim":"rgba(255, 255, 255, 1)","--sjs-general-backcolor-dim-light":"rgba(249, 249, 249, 1)","--sjs-general-backcolor-dim-dark":"rgba(243, 243, 243, 1)","--sjs-general-forecolor":"rgba(0, 0, 0, 0.91)","--sjs-general-forecolor-light":"rgba(0, 0, 0, 0.45)","--sjs-general-dim-forecolor":"rgba(0, 0, 0, 0.91)","--sjs-general-dim-forecolor-light":"rgba(0, 0, 0, 0.45)","--sjs-primary-backcolor":"rgba(14, 112, 64, 1)","--sjs-primary-backcolor-light":"rgba(14, 112, 64, 0.1)","--sjs-primary-backcolor-dark":"rgba(20, 164, 139, 1)","--sjs-primary-forecolor":"rgba(255, 255, 255, 1)","--sjs-primary-forecolor-light":"rgba(255, 255, 255, 0.25)","--sjs-base-unit":"6px","--sjs-corner-radius":"4px","--sjs-secondary-backcolor":"rgba(255, 152, 20, 1)","--sjs-secondary-backcolor-light":"rgba(255, 152, 20, 0.1)","--sjs-secondary-backcolor-semi-light":"rgba(255, 152, 20, 0.25)","--sjs-secondary-forecolor":"rgba(255, 255, 255, 1)","--sjs-secondary-forecolor-light":"rgba(255, 255, 255, 0.25)","--sjs-shadow-small":"0px 1px 2px 0px rgba(0, 0, 0, 0.15)","--sjs-shadow-small-reset":"0px 0px 0px 0px rgba(0, 0, 0, 0.15)","--sjs-shadow-medium":"0px 2px 6px 0px rgba(0, 0, 0, 0.1)","--sjs-shadow-large":"0px 8px 16px 0px rgba(0, 0, 0, 0.1)","--sjs-shadow-inner":"inset 0px 1px 2px 0px rgba(0, 0, 0, 0.15)","--sjs-shadow-inner-reset":"inset 0px 0px 0px 0px rgba(0, 0, 0, 0.15)","--sjs-border-light":"rgba(0, 0, 0, 0.09)","--sjs-border-default":"rgba(0, 0, 0, 0.16)","--sjs-border-inside":"rgba(0, 0, 0, 0.16)","--sjs-special-red":"rgba(229, 10, 62, 1)","--sjs-special-red-light":"rgba(229, 10, 62, 0.1)","--sjs-special-red-forecolor":"rgba(255, 255, 255, 1)","--sjs-special-green":"rgba(14, 112, 64, 1)","--sjs-special-green-light":"rgba(14, 112, 64, 0.1)","--sjs-special-green-forecolor":"rgba(255, 255, 255, 1)","--sjs-special-blue":"rgba(67, 127, 217, 1)","--sjs-special-blue-light":"rgba(67, 127, 217, 0.1)","--sjs-special-blue-forecolor":"rgba(255, 255, 255, 1)","--sjs-special-yellow":"rgba(255, 152, 20, 1)","--sjs-special-yellow-light":"rgba(255, 152, 20, 0.1)","--sjs-special-yellow-forecolor":"rgba(255, 255, 255, 1)","--sjs-article-font-xx-large-textDecoration":"none","--sjs-article-font-xx-large-fontWeight":"700","--sjs-article-font-xx-large-fontStyle":"normal","--sjs-article-font-xx-large-fontStretch":"normal","--sjs-article-font-xx-large-letterSpacing":"0","--sjs-article-font-xx-large-lineHeight":"64px","--sjs-article-font-xx-large-paragraphIndent":"0px","--sjs-article-font-xx-large-textCase":"none","--sjs-article-font-x-large-textDecoration":"none","--sjs-article-font-x-large-fontWeight":"700","--sjs-article-font-x-large-fontStyle":"normal","--sjs-article-font-x-large-fontStretch":"normal","--sjs-article-font-x-large-letterSpacing":"0","--sjs-article-font-x-large-lineHeight":"56px","--sjs-article-font-x-large-paragraphIndent":"0px","--sjs-article-font-x-large-textCase":"none","--sjs-article-font-large-textDecoration":"none","--sjs-article-font-large-fontWeight":"700","--sjs-article-font-large-fontStyle":"normal","--sjs-article-font-large-fontStretch":"normal","--sjs-article-font-large-letterSpacing":"0","--sjs-article-font-large-lineHeight":"40px","--sjs-article-font-large-paragraphIndent":"0px","--sjs-article-font-large-textCase":"none","--sjs-article-font-medium-textDecoration":"none","--sjs-article-font-medium-fontWeight":"700","--sjs-article-font-medium-fontStyle":"normal","--sjs-article-font-medium-fontStretch":"normal","--sjs-article-font-medium-letterSpacing":"0","--sjs-article-font-medium-lineHeight":"32px","--sjs-article-font-medium-paragraphIndent":"0px","--sjs-article-font-medium-textCase":"none","--sjs-article-font-default-textDecoration":"none","--sjs-article-font-default-fontWeight":"400","--sjs-article-font-default-fontStyle":"normal","--sjs-article-font-default-fontStretch":"normal","--sjs-article-font-default-letterSpacing":"0","--sjs-article-font-default-lineHeight":"28px","--sjs-article-font-default-paragraphIndent":"0px","--sjs-article-font-default-textCase":"none","--sjs-font-headertitle-color":"rgba(14, 112, 64, 1)","--sjs-font-headerdescription-color":"rgba(0, 0, 0, 0.45)","--sjs-header-backcolor":"transparent","--sjs-font-headertitle-size":"24px","--sjs-font-headerdescription-weight":"400","--sjs-font-size":"13.6px"},headerView:"advanced"};var n=()=>{let e=new a.Model(i);return e.applyTheme(l),(0,o.jsx)("section",{className:"section_markets section_text",children:(0,o.jsx)("div",{className:"section__content",children:(0,o.jsx)("div",{className:"container_page container_content",children:(0,o.jsx)(s.Survey,{model:e})})})})}},3834:function(){},3971:function(){},622:function(e,t,r){"use strict";var o=r(2265),a=Symbol.for("react.element"),s=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,l=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var o,s={},c=null,g=null;for(o in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(g=t.ref),t)i.call(t,o)&&!n.hasOwnProperty(o)&&(s[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===s[o]&&(s[o]=t[o]);return{$$typeof:a,type:e,key:c,ref:g,props:s,_owner:l.current}}t.Fragment=s,t.jsx=c,t.jsxs=c},7437:function(e,t,r){"use strict";e.exports=r(622)}},function(e){e.O(0,[513,144,242,971,938,744],function(){return e(e.s=3629)}),_N_E=e.O()}]);