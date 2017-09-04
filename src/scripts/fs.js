(function(window, fileSystem) {
    window.fs = fileSystem();
    new fs();
})(window, function() {
    var type,
        size,
        fs;

    function fileSystem() {
        util.requestQuota();
    }

    var util = {};

    util.requestQuota = function() {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.webkitStorageInfo.requestQuota(PERSISTENT, 5 * 1024 * 1024, util.requestFileSystem, errorHandler);
    }

    util.requestFileSystem = function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, function(fileSystem) {
            fs = fileSystem.root;
        }, errorHandler)
    }
    util.toArray = function(list) {
        return Array.prototype.slice.call(list || [], 0);
    }

    function errorHandler(e) {
        throw e.message;
    }



    fileSystem.prototype.readFile = function(fileName, callback) {
        fs.getFile(fileName, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                // var reader = new FileReader();

                // reader.onloadend = function(e) {
                //     var txtArea = document.createElement('textarea');
                //     txtArea.value = this.result;
                //     document.body.appendChild(txtArea);
                // };

                // reader.readAsText(file);
            })
        }, errorHandler);


    }

    fileSystem.prototype.readFolder = function(folderName, callback) {
        var dirReader = fs.createReader();
        var entries = [];

        var readEntries = function() {
            dirReader.readEntries(function(results) {
                if (!results.length) {
                    console.log(entries);
                    // listResults(entries.sort());
                } else {
                    entries = entries.concat(util.toArray(results));
                    readEntries();
                }
            }, errorHandler);
        };

        readEntries();

    }

    fileSystem.prototype.createFolder = function(path) {
        var path;


        var createDirectory = function(path, rootDirEntry) {

            if (typeof path === "string")
                path = path.split("/");

            if (path[0] === "." || path[0] === "")
                path.splice(1);

            if (!path.length)
                return;

            rootDirEntry.getDirectory(path[0], { create: true }, function(dirEntry) {
                if (path.length)
                    createDirectory(path.splice(1), dirEntry);
            }, errorHandler);
        }

        createDirectory(path, fs);

    }

    fileSystem.prototype.deleteFolder = function(path) {
        fs.getDirectory(path, {}, function(dirEntry) {
            dirEntry.remove(function() {
                console.log(path + ' Directory removed.');
            }, errorHandler);
        }, errorHandler);
    }

    fileSystem.prototype.deleteFile = function(fileName) {
        fs.getFile(fileName, { create: false }, function(fileEntry) {
            fileEntry.remove(function() {
                console.log(fileName + " has been removed")
            }, errorHandler)
        }, errorHandler);
    }



    fileSystem.prototype.writeFile = function(fileName, callback) {
        var file = path;
        var error;
        if (callback)
            callback(error, file)
    }


    return fileSystem;
})