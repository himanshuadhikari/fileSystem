Chanters("directory-structure", {
    noFiles: 'hide',
    hasFiles: 'hide',
    currentFolder: {},
    onReady: function() {
        this.getRootFolder();
    },
    getRootFolder: function(event, currentFolder) {
        fs.readDirectory({
            folder: currentFolder || "root",
            onSuccess: function(folders) {
                if (!folders) return;

                if (!folders.length) this.$.fileStructure.innerHTML = "";

                if (!folders.length) {
                    this.noFiles = 'show';
                    this.hasFiles = 'hide';
                }

                if (folders.length) {
                    this.noFiles = 'hide';
                    this.hasFiles = 'show';
                    this.$.fileStructure.innerHTML = "";
                    this.createTree(folders, this.$.fileStructure);
                }
            }.bind(this),
            onError: function(error) {
                console.log(error);
            }
        })
    },
    createFolder: function(event, folderObject) {
        var folderPath = prompt("Please enter folder path");
        if (!folderPath || folderPath && !folderPath.trim().length)
            return;

        var that = this;
        fs.createFolder(folderPath, function(currentFolder) {
            that.getRootFolder(undefined, that.currentFolder);
        }, folderObject);
    },
    deleteFolder: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var folder = event.currentTarget.folder;
        var userConfimation = confirm("Empty all items from " + folder.fullPath + "? \n All items in the " + folder.fullPath + " will be permanently deleted.");
        if (userConfimation) {
            var that = this;
            fs.removeRecursively(folder.fullPath, function() {
                that.getRootFolder();
            });
        }
    },
    createTree: function(folders, target) {
        var that = this;
        folders.forEach(function(folder) {
            var li = document.createElement('li');
            var a = document.createElement('a');

            if (folder.isDirectory)
                var i = '<i class="fa fa-folder" aria-hidden="true"></i><i class="fa fa-trash-o delete" aria-hidden="true"></i>';
            else
                var i = '<i class="fa fa-file" aria-hidden="true"></i><i class="fa fa-trash-o delete" aria-hidden="true"></i>';


            a.innerHTML = i;
            a.onclick = that.getFolder.bind(that);
            a.folder = folder;
            a.href = "";
            a.title = folder.fullPath;

            var btnDelete = a.querySelector(".delete");
            btnDelete.folder = folder;
            btnDelete.onclick = that.deleteFolder.bind(that);


            var em = document.createElement("em");
            em.textContent = folder.name;


            a.appendChild(em);
            li.appendChild(a);
            target.appendChild(li);
            console.log(folder);
        });
    },
    getFolder: function(event) {
        event.preventDefault();
        var folder = event.currentTarget.folder;
        this.currentFolder = folder;
        fs.readDirectory({
            folder: folder,
            onSuccess: function(folders) {
                if (!folders) return;

                if (!folders.length) {
                    this.noFiles = 'show';
                    this.hasFiles = 'hide';
                }

                if (folders.length) {
                    this.noFiles = 'hide';
                    this.hasFiles = 'show';
                    this.$.fileStructure.innerHTML = "";
                    this.createTree(folders, this.$.fileStructure);
                }
            }.bind(this),
            onError: function(error) {
                console.log(error);
            }
        })
    },
    addFiles: function(event, currentFolder) {
        console.log("addFiles", currentFolder);
    }
});