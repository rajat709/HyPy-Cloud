!function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=2)}({2:function(e,t){function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t,a){return(t=l(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,l(r.key),r)}}function l(e){var t=function(e,t){if("object"!==a(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!==a(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===a(t)?t:String(t)}var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),elementorFrontend.hooks.addAction("frontend/element_ready/eael-advanced-search.default",this.initFrontend.bind(this)),this.searchText=null,this.offset=0,this.catId=null,this.allPostsCount=0}var t,a,r;return t=e,(a=[{key:"initFrontend",value:function(e,t){ea.getToken(),this.scope=e,this.search=e[0].querySelector(".eael-advanced-search"),this.searchForm=e[0].querySelector(".eael-advanced-search-form"),this.settingsData=JSON.parse(this.searchForm.dataset.settings),this.$=t,this.showSearchResult(),this.SearchByText(),this.searchByKeyword(),this.hideContainer(e),this.cateOnChange(),this.onButtonClick(),this.loadMoreData(),this.clearData(e)}},{key:"showSearchResult",value:function(){if(!this.search)return!1;var e=this.scope;this.search.addEventListener("focus",this.inputSearchOnFocusBind.bind(this,e))}},{key:"inputSearchOnFocusBind",value:function(e,t){var a;if(null===(a=e[0])||void 0===a||!a.querySelector(".eael-advanced-search").value)return!1;var r=e[0].querySelector(".eael-advanced-search-result");""!==r.querySelector(".eael-advanced-search-content").innerHTML.trim()&&(r.style.display="block",this.popularkeyWordDispaly(!1,e))}},{key:"SearchByText",value:function(){var e=this,t=null,a=this.scope;a[0].querySelector(".eael-advanced-search").addEventListener("keyup",(function(r){var o,s;if(window.matchMedia("only screen and (max-width: 760px)").matches){if(32===r.keyCode||91===r.keyCode)return}else if(r.isComposing||229===r.keyCode||32===r.keyCode||91===r.keyCode)return;var l=r.target.value.trim();if(e.searchContainer=a[0].querySelector(".eael-advanced-search-result"),e.searchText=l,l.length<1)return e.clearOldData(e.searchContainer,a),e.searchContainer.style.display="none",e.popularkeyWordDispaly(!0,a),e.customTriggerEvent("advSearchClear",{$scope:a}),!1;e.searchForm=a[0].querySelector(".eael-advanced-search-form"),e.settingsData=JSON.parse(e.searchForm.dataset.settings);var i={action:"fetch_search_result",s:l,settings:n({},e.settingsData),nonce:localize.nonce};e.loader=a[0].querySelector(".eael-adv-search-loader");var c=null===(o=a[0].querySelector(".eael-adv-search-cate"))||void 0===o||null===(s=o.value)||void 0===s?void 0:s.trim();parseInt(c)>0&&(i.settings.cat_id=c),sessionStorage.getItem("eael_popular_keyword")&&e.searchText.length<3&&delete i.settings.show_popular_keyword,clearTimeout(t),t=setTimeout((function(){t=null,e.makeAjaxRequest(i,a)}),500)}))}},{key:"searchByKeyword",value:function(){document.addEventListener("click",this.searchByKeywordEventBind.bind(this),!1)}},{key:"searchByKeywordEventBind",value:function(e){if("eael-popular-keyword-item"!==e.target.className)return!1;this.searchText=e.target.dataset.keyword,this.triggerKeyupEvent(e)}},{key:"cateOnChange",value:function(){var e=this.searchForm.querySelector(".eael-adv-search-cate");if(!e)return!1;var t=this.scope;e.addEventListener("change",this.categoryOnChangeEvent.bind(this,t),!1)}},{key:"categoryOnChangeEvent",value:function(e,t){this.searchText=e[0].querySelector(".eael-advanced-search").value,this.catId=t.target.value,this.searchText&&this.triggerKeyupEvent(t)}},{key:"onButtonClick",value:function(){var e=this.searchForm.querySelector(".eael-advanced-search-button");if(!e)return!1;var t=this.scope;e.addEventListener("click",this.searchButtonClickBind.bind(this,t),!1)}},{key:"searchButtonClickBind",value:function(e,t){if(t.preventDefault(),this.searchText){var a=e[0].querySelector(".eael-advanced-search").value;this.searchText!==a?(this.searchText=a,this.triggerKeyupEvent(t)):(e[0].querySelector(".eael-advanced-search-result").style.display="block",this.popularkeyWordDispaly(!1,e))}}},{key:"loadMoreData",value:function(){var e=this.scope;e[0].querySelector(".eael-advanced-search-load-more-button").addEventListener("click",this.loadMoreDataBind.bind(this,e),!1)}},{key:"loadMoreDataBind",value:function(e,t){if(t.preventDefault(),!t.target.disabled){t.target.disabled=!0,this.searchForm=e[0].querySelector(".eael-advanced-search-form"),this.settingsData=JSON.parse(this.searchForm.dataset.settings),this.offset=parseInt(this.offset)+parseInt(this.settingsData.post_per_page);var a={action:"fetch_search_result",s:this.searchText,settings:n(n({},this.settingsData),{},{offset:this.offset,cat_id:this.catId}),nonce:localize.nonce};delete a.settings.show_category,delete a.settings.show_popular_keyword,this.$.ajax({url:localize.ajaxurl,type:"post",data:a,context:this,success:function(a){var r,n,o;t.target.style.display=null!==(r=a.data)&&void 0!==r&&r.more_data?"block":"none",null!==(n=a.data)&&void 0!==n&&n.post_lists&&(e[0].querySelector(".eael-advanced-search-result").querySelector(".eael-advanced-search-content").insertAdjacentHTML("beforeend",a.data.post_lists),this.allPostsCount=a.data.all_posts_count);var s=null===(o=a.data)||void 0===o||!o.post_lists;this.renderAllPostsCountContent(e,s),t.target.disabled=!1},error:function(a){t.target.style.display="none",this.renderAllPostsCountContent(e,!0),t.target.disabled=!1}})}}},{key:"manageRendering",value:function(e,t,a){t.style.display="block",this.contentNotFound=!0,this.offset=0,this.renderPopularKeyword(e,t),this.renderCategory(e,t),this.renderContent(e,t,a),this.contentNotFoundRender(a),this.popularkeyWordDispaly(!1,a);var r=a[0].querySelector(".eael-advanced-search").value.length;a[0].querySelector(".eael-adv-search-close").style.display=r>0?"block":"none"}},{key:"contentNotFoundRender",value:function(e){e[0].querySelector(".eael-advanced-search-not-found").style.display=this.contentNotFound?"block":"none",e[0].querySelector(".eael-advanced-search-result").style.maxHeight=this.contentNotFound?"inherit":""}},{key:"clearData",value:function(e){var t=this,a=this;e[0].querySelector(".eael-adv-search-close").addEventListener("click",(function(r){r.preventDefault(),e[0].querySelector(".eael-adv-search-close").style.display="none",e[0].querySelector(".eael-advanced-search").value="",e[0].querySelector(".eael-advanced-search-result").style.display="none",a.search="",t.popularkeyWordDispaly(!0,e)}))}},{key:"triggerKeyupEvent",value:function(e){var t=e.target.closest(".elementor-widget-eael-advanced-search").querySelector(".eael-advanced-search"),a=document.createEvent("HTMLEvents");t.value=this.searchText,a.initEvent("keyup",!1,!0),t.dispatchEvent(a)}},{key:"customTriggerEvent",value:function(e,t){var a=new CustomEvent(e,{detail:n({},t)});document.dispatchEvent(a)}},{key:"renderPopularKeyword",value:function(e,t){var a=t.querySelector(".eael-advanced-search-popular-keyword > .eael-popular-keyword-content");if(this.settingsData.show_popular_keyword){if(""==a.innerHTML){var r=sessionStorage.getItem("eael_popular_keyword");null!=e&&e.popular_keyword&&(r=e.popular_keyword,sessionStorage.setItem("eael_popular_keyword",r)),r?(a.parentElement.style.display="flex",a.innerHTML=r,this.contentNotFound=!1):a.parentElement.style.display="none"}}else a.parentElement.style.display="none"}},{key:"renderCategory",value:function(e,t){var a=t.querySelector(".eael-advanced-search-category .eael-popular-category-content");null!=e&&e.cate_lists?(this.contentNotFound=!1,a.parentElement.style.display="block",a.innerHTML=e.cate_lists):a.parentElement.style.display="none"}},{key:"renderContent",value:function(e,t,a){var r=t.querySelector(".eael-advanced-search-content");a[0].querySelector(".eael-advanced-search-load-more-button").style.display=null!=e&&e.more_data?"block":"none";var n=!0;null!=e&&e.post_lists?(this.contentNotFound=!1,r.style.display="block",r.innerHTML=e.post_lists,this.highlightSearchText(r,a),n=!1):(this.contentNotFound=!0,r.innerHTML="",r.style.display="none",this.allPostsCount>0&&(n=!1)),this.allPostsCount=e.all_posts_count,this.renderAllPostsCountContent(a,n)}},{key:"hideContainer",value:function(e){var t=this;document.addEventListener("click",(function(a){a.target.closest(".eael-advanced-search-widget")||(e[0].querySelector(".eael-advanced-search-result").style.display="none",t.popularkeyWordDispaly(!0,e))}))}},{key:"clearOldData",value:function(e,t){e.querySelector(".eael-popular-keyword-content").innerHTML="",e.querySelector(".eael-popular-category-content").innerHTML="",e.querySelector(".eael-advanced-search-content").innerHTML="",t[0].querySelector(".eael-adv-search-close").style.display="none"}},{key:"makeAjaxRequest",value:function(e,t){this.$.ajax({url:localize.ajaxurl,type:"post",data:e,context:this,beforeSend:function(){this.loader.style.display="block",t[0].querySelector(".eael-adv-search-close").style.display="none"},success:function(e){this.loader.style.display="none",this.manageRendering(e.data,this.searchContainer,t)},error:function(e){this.loader.style.display="none"}})}},{key:"popularkeyWordDispaly",value:function(e,t){var a=t[0].querySelector(".eael-after-adv-search");a&&(a.style.display=e?"flex":"none")}},{key:"renderAllPostsCountContent",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=e[0].querySelector(".eael-advanced-search-total-results-wrap"),r=e[0].querySelector(".eael-advanced-search-total-results-count");this.allPostsCount?(r&&(r.innerHTML=this.allPostsCount),a&&(a.style.display="block",a.parentNode.style.marginBottom="20px")):(r&&(r.innerHTML="0"),a&&(a.style.display="none",a.parentNode.style.marginBottom=0)),t&&0===this.allPostsCount&&a&&(a.style.display="none",a.parentNode.style.marginBottom=0)}},{key:"highlightSearchText",value:function(e,t){this.searchText&&e.querySelectorAll(".eael-search-text-highlight").forEach((function(t){var a=e.innerHTML,r=new RegExp(searchText,"gi"),n=a.replace(r,'<span class="eael-search-text-highlight">'.concat(searchText,"</span>"));t.innerHTML=n}))}}])&&s(t.prototype,a),r&&s(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();ea.hooks.addAction("init","ea",(function(){new i}))}});