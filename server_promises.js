const http = require('http');
const fs = require('fs').promises;
const path = require('path');

function printResult(result) {
    console.log(`There are ${result.newFiles.length} new files,` + 
                ` having ${result.newFilesSize/1048576} MB :`);
    for (let i in result.newFiles)
        console.log(result.newFiles[i]);
}

async function determineFiles() {
    const oldDirPath = "D:/IMAGES/Others'/Co";
    const newDirPath = "D:/IMAGES/Others'/Co - Copy"; // bigger directory

    const files = await fs.readdir(newDirPath); // daca vrei sa tratezi err-ul, bagi await-ul in try
                                                // readdir nu returneaza err, ci il arunca
    let result = {
        newFilesSize : 0,
        newFiles : [],
    };

    // Iterate the new folder's files and
    // check if present in the old folder also
    const filePromises = files.map( async (file) => {
        const oldFilePath = path.join(oldDirPath, file);
        const newFilePath = path.join(newDirPath, file);

        const newFileStats = await fs.stat(newFilePath);

        try {
            const oldFileStats = await fs.stat(oldFilePath);
        }
        catch {
            result.newFilesSize += newFileStats.size;
            result.newFiles.push(file);
        }

        // if (index == files.length-1){
        //     processResult(result);
        // }
    });
    await Promise.all(filePromises); // combina mai multe promise-uri in 1 care se va termina
                                    // cand se termina toate
    return result;
}

http.createServer(async (req, res) => {
    const fileResult = await determineFiles(); // tot ce CONTINE async, DEVINE async
                                            // deci await-ezi toate fctiile dupa care trebuie sa astepti
    printResult(fileResult);
    process.exit();
}).listen(8081);