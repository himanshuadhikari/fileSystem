# File System API for browsers
> This repo is for distribution on bower. File System API for browsers.

# Installation

```bower install fileSystem```

# Usage
```var fileSys = new fs();```
## Creating a folder
```fileSys.createFolder(path||"home" || "home/documents");```
## Deleting a folder
```fileSys.deleteFolder(path||"home" || "home/documents");```
## Deleting a file
```fileSys.deleteFile(path||"text.txt" || "home/text.txt");```
## Creating a file
```fileSys.createFile(path||"text.txt" || "home/text.txt");```
