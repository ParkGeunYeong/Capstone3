var xmlhttp_trigger = new XMLHttpRequest();
xmlhttp_trigger.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var url_from_trigger_data = JSON.parse(this.responseText);

    let triggers = {};
    for(let k in url_from_trigger_data){
      //console.log(k, url_from_trigger_data[k]);
      triggers[k] = chrome.contextMenus.create({
        "title": k + "번 " + url_from_trigger_data[k].text,
        "contexts":["page"],
        "id" : url_from_trigger_data[k]._id,
        "onclick" : pullTheTrigger
      });
    }

  }
};

var xmlhttp= new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var url_from_data = JSON.parse(this.responseText);
     console.log(url_from_data);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: url_from_data,
        toDo : "url_from"});
    });

  }
};

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let result = JSON.parse(this.responseText);
      // console.log(result);
    }
}


//현재 페이지의 북마크 생성
//현재 페이지에서 선택한 부분의 위치를 기억 후 트리거 생성
function SmartLinkTriggerOnClick(info, tab){
    //console.log(info);
    //console.log(tab);
    let selectedText = info.selectionText;
    //console.log(selectedText);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {text: selectedText,
          url_from : tab.url, toDo : "makeTrigger"}, function(response) {
          if(response.error){
            //console.log(response.error);
          } else{
            //console.log(response.hslBody);
            xhr.open("POST", 'http://121.140.222.97:41335/api/createHSL', true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(response.hslBody));

          }
        });
      });
}

function pullTheTrigger(info,tab){
  //console.log(info, tab)
  //console.log(info.pageUrl, info.pageUrl.length);
  let url_PUT = 'http://121.140.222.97:41335/api/updateHSL/' + info.menuItemId;
  xhr.open("PUT", url_PUT, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({url_to : info.pageUrl}));
  chrome.contextMenus.remove(info.menuItemId);
}

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(changeInfo.status === "complete"){
    chrome.contextMenus.removeAll();
    //기본 트리거 생성
    chrome.contextMenus.create({
    "title": "Let's find out \"%s\"!",
    "contexts":["selection"],
    "onclick": SmartLinkTriggerOnClick
    });

    console.log(tab.url);
    let trigger = `http://121.140.222.97:41335/api/trigger`;
    xmlhttp_trigger.open("GET", trigger,true);
    xmlhttp_trigger.send();

    let url_from = `http://121.140.222.97:41335/api/url_from/` + encodeURIComponent(tab.url);
    xmlhttp.open("GET", url_from,true);
    xmlhttp.send();

  }
})