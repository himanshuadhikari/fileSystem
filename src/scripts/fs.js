(function(window, fileSystem, util) {
    var fs_ = fileSystem(util);
    window.fs = new fs_();
})(window, function(util) {
    var type,
        size,
        _fs,
        utility = util(initFileSystem);

    function initFileSystem(result) {
        _fs = result;
    }

    function fileSystem() {
        utility.requestQuota();
    }

    fileSystem.prototype.init = function(options) {
        options = options || {};
        this.onSuccess = options.onSuccess;
        this.onError = options.onError;

        if (options.folder && options.folder.fullPath)
            this.folder = options.folder;
        else if (typeof options.folder === "string" && options.folder === "root")
            this.folder = _fs;

        if (!this.onSuccess)
            utility.errorHandler(new Error("Success handler function is required"));

        if (!this.onError)
            utility.errorHandler(new Error("Error handler function is required"));
    }

    fileSystem.prototype.readDirectory = function(options) {
        this.init(options);
        this.readFolder(this.folder);
    }

    fileSystem.prototype.readFolder = function(DirEntry) {
        var dirReader = DirEntry.createReader();
        var entries = [];
        var that = this;
        readEntries();

        function readEntries() {
            dirReader.readEntries(function(results) {
                if (!results.length && that.onSuccess) {
                    that.onSuccess(entries);
                } else {
                    entries = entries.concat(utility.toArray(results));
                    readEntries();
                }
            }, utility.errorHandler);
        };
    }


    fileSystem.prototype.deleteFolder = function(path) {
        _fs.getDirectory(path, {}, function(dirEntry) {
            dirEntry.remove(function() {
                console.log(path + ' Directory removed.');
            }, utility.errorHandler);
        }, utility.errorHandler);
    }


    fileSystem.prototype.removeRecursively = function(path, callback) {
        _fs.getDirectory(path, {}, function(dirEntry) {
            dirEntry.removeRecursively(function() {
                console.log(path + ' Directory removed.');
                callback();
            }, utility.errorHandler);
        }, utility.errorHandler);
    }

    fileSystem.prototype.createFolder = function(path, folderObject, callback) {
        var folderObject = folderObject && folderObject.fullPath ? folderObject : _fs;
        if (!path)
            console.error("folder path is required");

        if (typeof path === "string")
            path = path.split("/");

        if (path[0] === "." || path[0] === "")
            path.shift();


        var createDirectory = function(folderName, rootDirEntry) {

            rootDirEntry.getDirectory(folderName, { create: true }, function(dirEntry) {

                if (path.length) {
                    createDirectory(path.shift(), dirEntry);
                } else {
                    callback(dirEntry);
                }
            }, utility.errorHandler);
        }

        createDirectory(path.shift(), folderObject);

    }

    fileSystem.prototype.saveFile = function(options) {
        this.init(options);
        var that = this,
            count = 0,
            files = options.files;

        if (options.files && options.files.length)
            save(files[count]);

        function save(file) {
            that.folder.getFile(file.name, { create: true, exclusive: true }, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.write(file);

                    count++;
                    if (files[count])
                        save(files[count]);
                    else
                        that.onSuccess();

                }, utility.errorHandler);
            }, utility.errorHandler);
        }


    }

    fileSystem.prototype.deleteFile = function(options) {
        if (options.file && options.file.isFile)
            remove(options.file);
        else
            options.folder.getFile(options.file, { create: false }, function(fileEntry) {
                remove(fileEntry);
            }, utility.errorHandler);

        function remove(fileEntry) {
            fileEntry.remove(function() {
                console.log('File removed.');
                options.onSuccess();
            }, utility.errorHandler);
        }
    }

    fileSystem.prototype.readFile = function(options) {
        var that = this;

        this.init(options);

        this.folder.getFile(options.name, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                that.onSuccess(file);
            })
        }, errorHandler);


    }


    return fileSystem;
}, function util(callback) {
    var util = {};

    navigator.webkitPersistentStorage.queryUsageAndQuota(function(usedBytes, grantedBytes) {
        console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
    })

    util.requestQuota = function() {
        navigator.webkitPersistentStorage.requestQuota(10000 * 1024 * 1024, util.requestFileSystem, this.errorHandler);
    }

    util.requestFileSystem = function(grantedBytes) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(PERSISTENT, grantedBytes, function(fileSystem) {
            callback(fileSystem.root);
        }, this.errorHandler)
    }
    util.toArray = function(list) {
        return Array.prototype.slice.call(list || [], 0);
    }

    util.errorHandler = function(e) {
        throw e.message;
    }

    return util;
})