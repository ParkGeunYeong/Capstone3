var xmlhttp_trigger = new XMLHttpRequest();
xmlhttp_trigger.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var url_from_trigger_data = JSON.parse(this.responseText);
    console.log(url_from_trigger_data);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: url_from_trigger_data,
        toDo : "url_from_trigger"});
    });

    let triggers = {};
    for(let k in url_from_trigger_data){
      console.log(k, url_from_trigger_data[k]);
      triggers[k] = chrome.contextMenus.create({
        "title": k + "번 " + url_from_trigger_data[k].text,
        "contexts":["page"],
        "onclick" : pullTheTrigger
      });
    }

  }
};

var xmlhttp_ready = new XMLHttpRequest();
xmlhttp_ready.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    var url_from_ready_data = JSON.parse(this.responseText);
    console.log(url_from_ready_data);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: url_from_ready_data,
        toDo : "url_from_ready"});
    });

  }
};

//현재 페이지의 북마크 생성
//현재 페이지에서 선택한 부분의 위치를 기억 후 트리거 생성
function SmartLinkTriggerOnClick(info, tab){
    //console.log(info);
    //console.log(tab);
    let selectedText = info.selectionText;
    console.log(selectedText);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {text: selectedText,
          url_from : tab.url, toDo : "makeTrigger"}, function(response) {
          if(response.error){
            console.log(response.error);
          } else{
            console.log(response.hslBody);
          }
        });
      });
}

function pullTheTrigger(info,tab){
  console.log(info, tab)
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
    let url_from_trigger = `http://121.140.222.97:41335/api/url_from_trigger`;
    xmlhttp_trigger.open("GET", url_from_trigger,true);
    xmlhttp_trigger.send();

    let url_from_ready = `http://121.140.222.97:41335/api/url_from_ready/` + tab.url;
    xmlhttp_ready.open("GET", url_from_ready,true);
    xmlhttp_ready.send();

  }
})