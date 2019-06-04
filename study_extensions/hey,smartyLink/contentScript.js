chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let sel = window.getSelection();
        let selectedElement = sel.anchorNode.parentElement;
        let anchorNodeText = sel.anchorNode;

        if (request){
            sendResponse({XPath: getPathTo(selectedElement)});
            console.log(request.text);
        }

        let getElementByXPath = document.evaluate(getPathTo(selectedElement), document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;

        console.log(getElementByXPath);
        console.log(anchorNodeText);

        let parentStrIndex = getElementByXPath.indexOf(anchorNodeText);
        let childStrIndex = anchorNodeText.indexOf(request.text);

        console.log(parentStrIndex);
        console.log(childStrIndex);

        let wrap = document.createElement('a');
        wrap.id = 'SmartLink';
        wrap.style.border = '1px solid #999';
        wrap.href = "https://www.naver.com/";


        // let wrap = document.createElement('a');
        // wrap.id = 'SmartLink';
        // wrap.style.border = '1px solid #999'
        // wrap.href = "https://www.naver.com/"
        // let range = document.createRange();
        // if(sel.rangeCount == 1){
        //     range.setStart(getElementByXPath,selectedTextStartOffset);
        //     range.setEnd(getElementByXPath,selectedTextEndOffset);
        //     range.surroundContents(wrap);
        // } else{
        //     alert("1개 영역만 선택하세요.")
        // }
        
    });


function getPathTo(element) {
    if (element.tagName == 'HTML')
        return '/HTML[1]';
    if (element===document.body)
        return '/HTML[1]/BODY[1]';

    let ix= 0;
    let siblings= element.parentNode.childNodes;
    for (let i= 0; i<siblings.length; i++) {
        let sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
}