var bookmarksFile
chrome.bookmarks.getTree(function(tree) {
    bookmarksFile = tree;
})

var tabId
chrome.tabs.query({active: true}, function(tabs) {
    tabId = tabs[0]["id"]
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: main(),
    })
})

function main() {
    console.log(bookmarksFile)
    var bookmarkArr = bookmarksFile[0]["children"][0]["children"]
    var bookmarksList = []
    var unsortedBookmarks = []
    for(var i = 0; i < bookmarkArr.length; i++) {
        if(typeof bookmarkArr[i]["children"] != 'undefined') {
            bookmarksList.push(bookmarkArr[i])
        }
        else {
            unsortedBookmarks.push(bookmarkArr[i])
        }
    }
    var numberOfDirs = bookmarksList.length
    for (let i = 0; i < numberOfDirs; i++) {
        addElements(bookmarksList[i], i);
    }
    if(unsortedBookmarks.length > 0) {
        document.getElementById("bookmarks").innerHTML += `
            <div class="directory" id="directory-unsorted">
                <h2 class="directory-title">Unsorted Bookmarks</h2>
            </div>`
        addUnsortedElements(unsortedBookmarks)
    }
}

function addElements(elements, elementIndex) {
    var children = elements["children"]
    
    // Add HTML Code
    document.getElementById("bookmarks").innerHTML += `
    <div class="directory" id="directory${elementIndex}">
        <h2 class="directory-title">${elements["title"]}</h2>
    </div>
    `

    for (let i = 0; i < children.length; i++){
        document.getElementById("directory"+elementIndex).innerHTML += `
            <a class="card-title" href=${children[i]["url"]} target="_blank">    
                <div class="card">
                    <div class="thumbnail-div">
                        <!--<img class="thumbnail" src="http://www.getfavicon.org/get.pl?url=${children[i]["url"]}&submitget=get+favicon">-->
                        <div class="bookmark-icon"></div>
                    </div>
                    <div class="card-title-div">
                        ${children[i]["title"]}
                    </div>           
                </div>
            </a> 
        `
    }
}

function addUnsortedElements(elements) {
    for (var i = 0; i < elements.length; i++) {
        document.getElementById("directory-unsorted").innerHTML += `
            <a class="card-title" href="${elements[i]["url"]}" target="_blank">
                <div class="card">
                    <div class="thumbnail-div">
                        <!--<img class="thumbnail" src="https://jrehkemper.de/img/favicon.svg">-->
                        <div class="bookmark-icon"></div>
                    </div>
                    <div class="card-title-div">
                        ${elements[i]["title"]}
                    </div>
                </div>
            </a>
        `
    }
}
