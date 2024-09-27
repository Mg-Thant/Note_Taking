const fs = require("fs");

exports.fileDel = (filePath) => {
    fs.unlink(filePath, (err) => {
        if(err) throw err;
        console.log("Successfully Deleted!!")
    })
}