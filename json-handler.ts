const { create } = require("domain");
const fs = require("fs");
const path = require("path");

export function isJson(path: any) {
  return path.endsWith(".json");
}

export function fileExists(path: any) {
  return fs.existsSync(path);
}

export function readJSON(...JSONfile: any) {
  const jsonFilePath = path.join(...JSONfile);

  if (isJson(jsonFilePath) && fileExists(jsonFilePath)) {
    return JSON.parse(fs.readFileSync(jsonFilePath).toString());
  } else {
    console.log("file does not exist or its not a json file");
  }
}

export function createJSON(JSONfile: any, JSONcontent: {}, indent = 2) {
  const jsonFilePath = path.join(...JSONfile);

  /* if (fileExists(jsonFilePath)) { */
  return fs.writeFileSync(
    jsonFilePath,
    JSON.stringify(JSONcontent, null, indent)
  );
  /* } else {
    console.log("type a valid path");
  } */
}

export function deleteJSON(JSONPath: any) {
  const jsonFilePath = path.join(...JSONPath);
  fs.unlinkSync(jsonFilePath);
}

export function overwriteJSON(JSONfile: any, JSONcontent: {}, indent = 2) {
  const jsonFilePath = path.join(...JSONfile);
  fs.writeFileSync(jsonFilePath, JSON.stringify(JSONcontent, null, indent));
}

export function updateJSON(JSONfile: any, newContent: {}, indent = 2) {
  const jsonFilePath = path.join(...JSONfile);
  const currentJsonContent = JSON.parse(
    fs.readFileSync(jsonFilePath).toString()
  );
  const nextJsonContent = { ...currentJsonContent, ...newContent };
  fs.writeFileSync(jsonFilePath, JSON.stringify(nextJsonContent, null, indent));
}
