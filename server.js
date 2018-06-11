const http = require('http');
const fs = require('fs');
const path = require('path');

function printResult(result) {
    console.log(`There are ${result.newFiles.length} new files,` + 
                ` having ${result.newFilesSize/1048576} MB :`);
    for (let i in result.newFiles)
        console.log(result.newFiles[i]);
}

function determineFiles(processResult) {
        const oldDirPath = "D:/IMAGES/Others'/Co";
        const newDirPath = "D:/IMAGES/Others'/Co - Copy"; // bigger directory
    
        fs.readdir(newDirPath, (err, files) => {
            if (err) {
                console.error("Could not list the dir.", err);
            }
    
            let result = {
                newFilesSize : 0,
                newFiles : [],
            };
    
            // Iterate the new folder's files and
            // check if present in the old folder also
            files.forEach( (file, index) => {
                const filePath1 = path.join(oldDirPath, file);
                const filePath2 = path.join(newDirPath, file);
                var currentFileSize = 0;
                
                fs.stat(filePath2, (err, stats) => {
                    currentFileSize = stats.size;
    
                    fs.stat(filePath1, (err, stats) => {
                        if (err) {
                            result.newFilesSize += currentFileSize;
                            result.newFiles.push(file);
                        }
                        if (index == files.length-1){
                            processResult(result);
                        }
                    });
                });
            });
        });
}

http.createServer((req, res) => {
    determineFiles(printResult);
}).listen(8081);