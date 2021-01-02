var itemsDict={},lastCursorDict={};+localStorage.getItem("timeout")||localStorage.setItem("timeout",1e3);var tiktokParse=()=>{const t=document.querySelector('meta[property="twitter:creator:id"]').content,e=document.querySelectorAll(".video-feed-item-wrapper").length,a=document.querySelectorAll(".video-feed-item-wrapper.marked").length;let o;if(lastCursorDict[t]||itemsDict[t]&&e<=a)return addViewsCount(t,"data-Views","playCount"),addViewsCount(t,"data-Shares","shareCount"),addViewsCount(t,"data-Comments","commentCount"),addAverageCounterPerVideo(t,"data-avg-Views","playCount"),addAverageCounterPerVideo(t,"data-avg-Shares","shareCount"),addAverageCounterPerVideo(t,"data-avg-Comments","commentCount"),void addAverageERPerVideo(t,"data-avg-ER");if(itemsDict[t]&&itemsDict[t].length){const e=itemsDict[t].reduce((t,e)=>t<e.createTime?t:e.createTime);o=1e3*e}else o=1e3*(new Date).getTime(),itemsDict[t]=[];const d=document.querySelector('meta[property="al:ios:url"]').content,n=new URL(`https://tiktok.com/${d.replace("snssdk1233://","")}`),s=n.pathname.split("/")[n.pathname.split("/").length-1];let r=new XMLHttpRequest;r.open("GET",`https://m.tiktok.com/api/item_list/?count=30&id=${s}&maxCursor=${o}&minCursor=0&sourceType=8`),r.responseType="json",r.onload=function(){localStorage.setItem("timeout",1e3);let e=r.response;if(e.hasMore||(lastCursorDict[t]=o),!e.items&&itemsDict[t]&&itemsDict[t].length){for(let e=0;e<itemsDict[t].length;e++){const a=itemsDict[t][e],o=document.querySelector(`a[href^="https://www.tiktok.com/@${t}/video/${a.id}"]`);o&&addItem(a,o)}document.querySelectorAll(`a[href^="https://www.tiktok.com/@${t}/video/"]`).forEach(t=>t.classList.add("marked")),sortByER()}else{itemsDict[t].push(...e.items),addViewsCount(t,"data-Views","playCount"),addViewsCount(t,"data-Shares","shareCount"),addViewsCount(t,"data-Comments","commentCount"),addAverageCounterPerVideo(t,"data-avg-Views","playCount"),addAverageCounterPerVideo(t,"data-avg-Shares","shareCount"),addAverageCounterPerVideo(t,"data-avg-Comments","commentCount"),addAverageERPerVideo(t,"data-avg-ER");for(let a=0;a<e.items.length;a++){const o=e.items[a],d=document.querySelector(`a[href^="https://www.tiktok.com/@${t}/video/${o.id}"]`);d&&addItem(o,d)}sortByER()}},r.onerror=(()=>{localStorage.setItem("timeout",2e4)}),r.send(),clearInterval(interval),interval=setInterval(tiktokParse,+localStorage.getItem("timeout"))},interval=setInterval(tiktokParse,+localStorage.getItem("timeout"));let addItem=(t,e)=>{if(e.getAttribute("data-ER"))return;addLikes(e,t.stats.diggCount);const a=document.createElement("strong");a.classList.add("jsx-1036923518"),a.classList.add("video_bottom-info"),e.querySelector(".jsx-1036923518.card-footer.normal.no-avatar").appendChild(a),addShare(a,t),addComment(a,t),addER(e,t),e.classList.add("marked")},addShare=(t,e)=>{const a=document.createElement("svg");a.classList.add("custom-share");const o=document.createElement("strong");o.classList.add("jsx-1036923518"),o.classList.add("video_count"),o.innerText=e.stats.shareCount,t.appendChild(a),t.appendChild(o)},addComment=(t,e)=>{const a=document.createElement("strong");a.classList.add("custom-comment");const o=document.createElement("strong");o.classList.add("jsx-1036923518"),o.classList.add("video_count"),o.innerText=e.stats.commentCount,t.appendChild(a),t.appendChild(o)},addER=(t,e)=>{const a=document.createElement("strong");a.classList.add("jsx-1036923518"),a.classList.add("video_bottom-info"),t.querySelector(".jsx-1036923518.card-footer.normal.no-avatar").appendChild(a);const o=document.createElement("svg");o.classList.add("jsx-1036923518"),o.classList.add("video_count"),o.textContent="ER",a.appendChild(o);const d=document.createElement("strong");d.classList.add("jsx-1036923518"),d.classList.add("video_count");const n=100*(e.stats.commentCount+e.stats.diggCount+e.stats.shareCount)/e.stats.playCount;d.innerText=n.toFixed(2)+"%",a.appendChild(d),t.setAttribute("data-ER",n)},addLikes=(t,e)=>{const a=document.createElement("strong");a.classList.add("custom-like");const o=document.createElement("strong");o.classList.add("jsx-1036923518"),o.classList.add("video_count"),o.innerText=e,t.querySelector(".jsx-1036923518 .video_bottom-info").appendChild(a),t.querySelector(".jsx-1036923518 .video_bottom-info").appendChild(o)},sortByER=()=>{var t=Array.from(document.querySelectorAll("a[data-ER]"));(t=(t=t.sort((t,e)=>+t.getAttribute("data-ER")>+e.getAttribute("data-ER")?-1:+t.getAttribute("data-ER")<+e.getAttribute("data-ER")?1:0)).map(t=>t.closest(".video-feed-item.three-column-item"))).forEach(t=>document.querySelector(".video-feed.compact").appendChild(t))},convertNumberToString=t=>{let e="";return e=t>1e6?`${(t/1e6).toFixed(1)}M`:t>1e3?`${(t/1e3).toFixed(1)}K`:t},addAverageERPerVideo=(t,e)=>{const a=(itemsDict[t].reduce((t,e)=>t+(t=>100*(t.stats.commentCount+t.stats.diggCount+t.stats.shareCount)/t.stats.playCount)(e),0)/itemsDict[t].length).toFixed(2)+"%",o=document.querySelector(".count-infos");let d=document.querySelector(`div[${e}]`);d||((d=document.createElement("div")).classList.add("number"),o.appendChild(d)),d.setAttribute(`${e}`,a);let n=document.querySelector(`div[${e}]`);n||((n=document.createElement("strong")).title=`Avg.${e.split("data-avg-")[1]}`,d.appendChild(n)),n.textContent=a,n.setAttribute(`${e}`,a);const s=document.createElement("span");s.classList.add("unit"),s.textContent=`Avg.${e.split("data-avg-")[1]}`,d.appendChild(s)},addAverageCounterPerVideo=(t,e,a)=>{const o=(itemsDict[t].reduce((t,e)=>t+e.stats[a],0)/itemsDict[t].length).toFixed(1),d=document.querySelector(".count-infos");let n=document.querySelector(`div[${e}]`);n||((n=document.createElement("div")).classList.add("number"),d.appendChild(n)),n.setAttribute(`${e}`,convertNumberToString(o));let s=document.querySelector(`div[${e}]`);s||((s=document.createElement("strong")).title=`Avg.${e.split("data-avg-")[1]}`,n.appendChild(s)),s.textContent=convertNumberToString(o),s.setAttribute(`${e}`,convertNumberToString(o));const r=document.createElement("span");r.classList.add("unit"),r.textContent=`Avg.${e.split("data-avg-")[1]}`,n.appendChild(r)},addViewsCount=(t,e,a)=>{const o=itemsDict[t].reduce((t,e)=>t+e.stats[a],0),d=document.querySelector(".count-infos");let n=document.querySelector(`div[${e}]`);n||((n=document.createElement("div")).classList.add("number"),d.appendChild(n)),n.setAttribute(`${e}`,convertNumberToString(o));let s=document.querySelector(`div[${e}]`);s||((s=document.createElement("strong")).title=e.split("data-")[1],n.appendChild(s)),s.textContent=convertNumberToString(o),s.setAttribute(`${e}`,convertNumberToString(o));const r=document.createElement("span");r.classList.add("unit"),r.textContent=e.split("data-")[1],n.appendChild(r)};
