chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let sel = window.getSelection();
        let selectedElement = sel.anchorNode.parentElement;
        let anchorNodeText = sel.anchorNode.textContent;

        if (request){
            sendResponse({XPath: getPathTo(selectedElement)});
            //console.log(request.text);
        }

        let getElementByXPath = document.evaluate(getPathTo(selectedElement),document,
          null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
          = document.evaluate(getPathTo(selectedElement),document,
          null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
          .replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">")
          .replace(/&amp;/g,"&").replace(/&quot;/g,'"');

        // console.log(getElementByXPath);
        // console.log(anchorNodeText);
        // console.log(request.text);

        let parentStrIndex = getElementByXPath.indexOf(anchorNodeText);
        let childStrIndex = anchorNodeText.indexOf(request.text);

        console.log(parentStrIndex);
        console.log(childStrIndex);
        console.log(request.text.length);
        console.log(Date.now());

        if(parentStrIndex != -1 && childStrIndex != -1){
            let mid = `<a href="https://www.naver.com/" id="SmartLink" \
            style="border : 1px solid #999; color : red;">\
            ${request.text}</a>`
            let frontHTML = getElementByXPath.slice(0, parentStrIndex + childStrIndex);
            let backHTML = getElementByXPath.slice(
            parentStrIndex + childStrIndex + request.text.length, getElementByXPath.length)
            let modifiedHTML = frontHTML + mid + backHTML;

            // console.log(modifiedHTML);
            document.evaluate(getPathTo(selectedElement),document, null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = modifiedHTML;
        }
        
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