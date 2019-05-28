// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
  alert("in works!!!!!");

  let parent_s = chrome.contextMenus.create(
    {"title": "Test parent_s item", "contexts" : ["selection"]});
    let child1_s = chrome.contextMenus.create(
    {"title": "Child 1 S", "parentId": parent_s, "onclick": genericOnClick ,
     "contexts" : ["selection"]});
     let child2_s = chrome.contextMenus.create(
    {"title": "Child 2 S", "parentId": parent_s, "onclick": genericOnClick ,
     "contexts" : ["selection"]});
  console.log("parent:" + parent_s + " child1:" + child1_s + " child2:" + child2_s);
}
// //Create one test item for each context type.
// var contexts = ["page","selection","link","editable","image","video",
//                 "audio"];
// for (var i = 0; i < contexts.length; i++) {
//   var context = contexts[i];
//   var title = "Test '" + context + "' menu item";
//   var id = chrome.contextMenus.create({"title": title, "contexts":[context],
//                                        "onclick": genericOnClick});
//   console.log("'" + context + "' item:" + id);
// }


// var parent = chrome.contextMenus.create({"title": "Test parent item"});
// var child1 = chrome.contextMenus.create(
//   {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});
// var child2 = chrome.contextMenus.create(
//   {"title": "Child 2", "parentId": parent, "onclick": genericOnClick});
// console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);




//드래그 후 메뉴
chrome.contextMenus.create({"title": "Let's Find Out", "contexts":["selection"],
                                       "onclick": genericOnClick});