
//현재 페이지의 북마크 생성
//현재 페이지에서 선택한 부분의 위치를 기억 후 트리거 생성
function SmartLinkTriggerOnClick(info, tab){
    //console.log(info);
    //console.log(tab);
    let selectedText = info.selectionText;
    console.log(selectedText);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {text: selectedText}, function(response) {
          console.log(response.XPath);
          
        });
      });
}


chrome.runtime.onInstalled.addListener(function() {

    //기본 트리거 생성
    const SmartLinkTriggerId = chrome.contextMenus.create({
        "title": "Let's find out \"%s\"!",
        "contexts":["selection"],
        "onclick": SmartLinkTriggerOnClick
    });
});