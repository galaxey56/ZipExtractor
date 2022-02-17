import React, { useEffect } from "react";
import * as zip from "@zip.js/zip.js";
import { useState } from "react";
import TreeView from "react-jstree-table";
import "./Zip.css";
import imageURL from "../file-solid.svg";
const Zip = (props) => {
  const [fileObject, setFileObject] = useState();
  const [downloadableURL, setDownloadableURL] = useState();
  const [selectedFileObject, setSelectedFileObject] = useState({
    selected: null,
  });
  const [displayTree, setDisplayTree] = useState(false);
  const [treeJSON, setTreeJSON] = useState({
    data: {
      core: {
        data: [],
      },
    },
  });
  const [entries, setEntries] = useState([]);
  const [canDownload, setCanDownload] = useState(false);
  const findIndex = (array, name) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].text === name) {
        return i;
      }
    }
    return -1;
  };
  const formHandler = async (event) => {
    event.preventDefault();

    //Creating a JSON Object out of entries
    try {
      const reader = new zip.ZipReader(new zip.BlobReader(fileObject), []);
      let entry = await reader.getEntries();
      const filePathArray = entry.map((entry) => entry.filename.split("/"));
      const jsonObjectStorer = [];
      var maxLength = 0;
      filePathArray.map((filiteredNameArray) => {
        maxLength =
          filiteredNameArray.length > maxLength
            ? filiteredNameArray.length
            : maxLength;
        return null;
      });
      setEntries(entry);

      for (let i = 0; i < filePathArray.length; i++) {
        let traversingStorer = jsonObjectStorer;
        for (let j = 0; j < maxLength; j++) {
          if (filePathArray[i][j]) {
            if (findIndex(traversingStorer, filePathArray[i][j]) === -1) {
              if (filePathArray[i].length - 1 === j) {
                traversingStorer.push({
                  id: filePathArray[i].join("/"),
                  icon: imageURL,
                  text: filePathArray[i][j],
                  children: [],
                });
                continue;
              } else {
                traversingStorer.push({
                  text: filePathArray[i][j],
                  children: [],
                });
                continue;
              }
            }
            traversingStorer =
              traversingStorer[findIndex(traversingStorer, filePathArray[i][j])]
                .children;
          }
        }
      }

      //Sorting such that all files show at top and folders at bottom
      jsonObjectStorer.sort((a, b) => {
        if (a.children.length > 0 && b.children.length > 0) {
          if (a.text < b.text) return -1;
          else if (a.text > b.text) return 1;
          else return 0;
        }
        if (a.children.length > 0 && b.children.length === 0) {
          return 1;
        }
        if (a.children.length === 0 && b.children.length > 0) {
          return -1;
        }
        if (a.children.length === 0 && b.children.length === 0) {
          if (a.text < b.text) return -1;
          else if (a.text > b.text) return 1;
          else return 0;
        }
        return 0;
      });

      setTreeJSON((prevTree) => {
        let trees = {
          data: {
            core: {
              data: [{ text: fileObject.name, children: [] }],
            },
          },
        };
        trees.data.core.data[0].children = [...jsonObjectStorer];
        return trees;
      });
      setDisplayTree((prevShow) => !prevShow);
      await reader.close();
    } catch (error) {
      props.handler();
      console.log(error);
    }
  };

  const inputHandler = (event) => {
    setFileObject(event.target.files[0]);
  };

  const downloadFile = async (fileName) => {
    let fileIndex = -1;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].filename === fileName) fileIndex = i;
    }
    if (fileIndex === -1) {
      setCanDownload(false);
      return;
    } else {
      setCanDownload(true);
    }
    var x;
    for (let i = entries[fileIndex].filename.length - 1; i > -1; i--) {
      if (entries[fileIndex].filename[i] === ".") {
        x = i;
      }
    }
    const string = entries[fileIndex].filename.substring(
      x + 1,
      entries[fileIndex].filename.length
    );
    const blobWriter = new zip.BlobWriter("application/" + string);
    console.log(entries[fileIndex]);
    const fileData = await entries[fileIndex].getData(blobWriter);
    setDownloadableURL(URL.createObjectURL(fileData));
  };

  useEffect(() => {
    console.log(selectedFileObject);
    if (selectedFileObject.selected != null) {
      downloadFile(selectedFileObject.selected[0]);
    }
    if (canDownload) downloadTrig();
  }, [selectedFileObject]);

  const downloadTrig = () => {
    const a = document.createElement("a");
    a.href = downloadableURL;
    let pseudoFileNameSplit = selectedFileObject.selected[0].split("/");
    a.download = pseudoFileNameSplit[pseudoFileNameSplit.length - 1];
    a.click();
  };

  function handleChange(e, data) {
    setSelectedFileObject({ selected: data.selected });
  }
  return (
    <>
      {!displayTree && (
        <div className="container-sm cont">
          <div className="upload">
            <form onSubmit={formHandler}>
              <button className="btn btn-outline-secondary btn-lg upload">
                <input
                  multiple
                  type="file"
                  name="file"
                  className="sizing"
                  onChange={inputHandler}
                />
              </button>
              &nbsp;&nbsp;&nbsp;
              <button type="submit" className="btn btn-primary ">
                Extract ZIP
              </button>
              {selectedFileObject.selected && (
                <a
                  href={downloadableURL}
                  download={selectedFileObject.selected[0]}
                >
                  <button type="button">click me</button>
                </a>
              )}
            </form>
          </div>
        </div>
      )}
      {displayTree && (
        <div className="container-lg cont">
          <h2 className="text-center">{fileObject.name}</h2>
          <a href={URL.createObjectURL(fileObject)} download={fileObject.name}>
            <button type="submit" className="btn btn-primary">
              Save all as Zip
            </button>
          </a>
          <br />
          <br />
          <br />
          <TreeView
            treeData={treeJSON.data}
            onChange={(e, data) => handleChange(e, data)}
          />
          <br />
          <br />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              setDisplayTree((prevShow) => !prevShow);
            }}
          >
            Extract Another Archive
          </button>
          <br />
          <br />
        </div>
      )}
    </>
  );
};

export default Zip;
