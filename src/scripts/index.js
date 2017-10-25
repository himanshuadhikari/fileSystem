(function(window) {
    var folderContainer = document.querySelector("#root");
    var homeButton = document.querySelector("#btnHome");
    homeButton.onclick = getRootFolder;

    function getRootFolder() {
        fileSystem.readFolder("/", function(folders) {
            if (!folders) return;

            if (!folders.length) {
                var li = createElement('li');
                var span = createElement('span');
                span.textContent = "No files and folders added yet";
                li.appendChild(span);
                folderContainer.appendChild(li);
            }

            if (folders.length)
                console.log(folders);
        });
    }

    function createElement(tagName) {
        return document.createElement(tagName);
    }

})(window);