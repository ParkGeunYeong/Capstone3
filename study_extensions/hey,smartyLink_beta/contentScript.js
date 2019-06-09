chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if(request.toDo === "makeTrigger"){
        let sel = window.getSelection();
        let selectedElement = sel.anchorNode.parentElement;
        let XPath = getPathTo(selectedElement);
        let anchorNodeText = sel.anchorNode.textContent;
        let getElementByXPath = document.evaluate(XPath,document,
          null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
          = document.evaluate(XPath,document,
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
            let mid = `<a href="#" id="SmartLink" \
            style="border : 1px solid #999; color : red;">\
            ${request.text}</a>`
            let frontHTML = getElementByXPath.slice(0, parentStrIndex + childStrIndex);
            let backHTML = getElementByXPath.slice(
            parentStrIndex + childStrIndex + request.text.length, getElementByXPath.length)
            let modifiedHTML = frontHTML + mid + backHTML;

            // console.log(modifiedHTML);
            document.evaluate(XPath,document, null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = modifiedHTML;
        
        }

        let hslBody = {
            url_to : "yet",
            published_date : Date.now(),
            url_from : request.url_from,
            XPath : XPath,
            parentStrIndex : parentStrIndex,
            childStrIndex : childStrIndex,
            textLength : request.text.length,
            text : request.text
        }
        if(hslBody.parentStrIndex != -1 && hslBody.childStrIndex != -1){
            sendResponse({hslBody});
        } else{
            sendResponse({error : "error"});
        }
        

    } else if(request.toDo === "url_from_trigger"){

        console.log(request.data);

    //준비된 데이터 불러와서 페이지 수정하기
    } else if(request.toDo === "url_from_ready"){
        for(let k in request.data){
            console.log(k, request.data[k]);

            let getElementByXPath = document.evaluate(request.data[k].XPath,document,
                null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
                = document.evaluate(request.data[k].XPath,document,
                null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
                .replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">")
                .replace(/&amp;/g,"&").replace(/&quot;/g,'"');

            let mid = `<a href=${request.data[k].url_to} id="SmartLink" \
            style="border : 1px solid #999; color : green;">\
            ${request.data[k].text}</a>`
            let frontHTML = getElementByXPath.slice(0, request.data[k].parentStrIndex 
                + request.data[k].childStrIndex);
            let backHTML = getElementByXPath.slice(
                request.data[k].parentStrIndex + request.data[k].childStrIndex 
                + request.data[k].textLength, getElementByXPath.length)
            let modifiedHTML = frontHTML + mid + backHTML;
            document.evaluate(request.data[k].XPath,document, null, 
                XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML = modifiedHTML;
            

        }
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


