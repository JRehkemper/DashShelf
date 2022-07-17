var tabId
chrome.tabs.query({active: true}, function(tabs) {
    tabId = tabs[0]["id"]
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: main,
    })
})


function main() {
    var bookmarksList = bookmarksFile["roots"]["bookmark_bar"]["children"]
    console.log(bookmarksList)
    var numberOfDirs = bookmarksList.length
    for (let i = 0; i < numberOfDirs; i++) {
        addElements(bookmarksList[i], i);
    }
}

function addElements(elements, elementIndex) {
    console.log(elements["name"])
    var children = elements["children"]
    

    // Add HTML Code
    document.getElementById("bookmarks").innerHTML += `
    <div class="directory" id="directory${elementIndex}">
        <h2 class="directory-title">${elements["name"]}</h2>
    </div>
    `

    console.log(children[0])
    for (let i = 0; i < children.length; i++){
        document.getElementById("directory"+elementIndex).innerHTML += `
            <div class="card">
                <div class="thumbnail-div">
                    <img class="thumbnail" src="https://jrehkemper.de/img/favicon.svg">
                </div>
                <div class="card-title-div">
                    <a class="card-title" href=${children[i]["url"]} target="_blank">${children[i]["name"]}</a>    
                </div>
            </div>
        `
    }
    console.log(document.getElementById("directory"+elementIndex))
}
