const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    const dirPath1 = 'D:/IMAGES/motivationals';
    const dirPath2 = 'D:/IMAGES/motivationals_june1'; // bigger directory

    fs.readdir(dirPath2, (err, files) => {
        if (err) {
            console.error("Could not list the dir.", err);
        }

        let newFilesSize = 0;

        // Iterate 2nd folder's files and
        // check if present in 1st folder also
        files.forEach( (file, index) => {
            const filePath1 = path.join(dirPath1, file);
            const filePath2 = path.join(dirPath2, file);
            let currentFileSize = 0;
            
            // fs.stat(filePath2, (err, stats) => {
            //     currentFileSize = stats.size;
            // });
            let stats = fs.statSync(filePath2);
            currentFileSize = stats.size;
            console.log(currentFileSize + " bytes");
            
            try {
                stats = fs.statSync(filePath1);
            }
            catch (err) {
                newFilesSize += currentFileSize;
            }
            // if (stats.error) {
            //     newFilesSize += currentFileSize;
            // }
        });

        console.log(`New files have ${newFilesSize/1048576} MB`);
    });
}).listen(8081);