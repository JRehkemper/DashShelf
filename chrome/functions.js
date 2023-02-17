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
    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()
    console.log(typeof month)
    var year = date.getFullYear()
    var dow = date.getDay()
    var dayOfWeek = "";
    switch(dow) {
        case 1:
            dayOfWeek = "Monday"
            break;
        case 2:
            dayOfWeek = "Tuesday"
            break;
        case 3:
            dayOfWeek = "Wednesday"
            break;
        case 4:
            dayOfWeek = "Thursday"
            break;
        case 5:
            dayOfWeek = "Friday"
            break;
        case 6:
            dayOfWeek = "Saturday"
            break;
        case 7:
            dayOfWeek = "Sunday"
            break;
    }
    var monthString = ""
    switch(month) {
        case 0:
            monthString = "January"
            break;
        case 1:
            monthString = "February"
            break;
        case 2:
            monthString = "March"
            break;
        case 3:
            monthString = "April"
            break;
        case 4:
            monthString = "May"
            break;
        case 5:
            monthString = "June"
            break;
        case 6:
            monthString = "July"
            break;
        case 7:
            monthString = "August"
            break;
        case 8:
            monthString = "September"
            break;
        case 9:
            monthString = "October"
            break;
        case 10:
            monthString = "November"
            break;
        case 11:
            monthString = "December"
            break;
    }
    var dateString = dayOfWeek+" "+day+". "+monthString+" "+year
    document.getElementById("date").innerHTML+= dateString
    document.getElementById("save-width").addEventListener('click', saveWidth)
    try {
        chrome.storage.sync.get(["width"], function(result) {
            console.log('Width loaded is ' + result.width);
            const root = document.documentElement
            root.style.setProperty("--width", result.width)
            document.getElementById("slider").value = result.width.replace("px", "")
        });
    }
    catch {
        console.log("Couldn't load old width,")
        document.getElementById("slider").value = "350px"
    }
    const slider = document.getElementById("slider");
    slider.addEventListener("input", function(e) {
        const root = document.documentElement
        root.style.setProperty("--width", e.target.value+"px")
    })
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

function saveWidth() {
    width = document.getElementById("slider").value+"px"
    //console.log(width)
    chrome.storage.sync.set({"width": width}, function() {
        console.log('Width is set to ' + width);
    });
    alert("Width successfully saved")
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
        var favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(children[i]["url"])}&size=32`;
        document.getElementById("directory"+elementIndex).innerHTML += `
            <a class="card-title" href=${children[i]["url"]} target="_blank">    
                <div class="card">
                    <div class="thumbnail-div">
                        <img class="thumbnail" src="${favicon}">
                        <!--<div class="bookmark-icon"></div>-->
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
