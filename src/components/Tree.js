import React, { Component } from "react";
import TreeView from "react-jstree-table";

export class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        core: {
          data: [
            'Hello world',
            {
              text: "Root node",
              children: [{ text: "Child node 1" }, { text: "Child node 2" }],
            },
            {
              text: "Root node",
              children: [{ text: "Child node 1" }, { text: "Child node 2" }],
            },
          ],
        },
      },
      selected: [],
    };
  }

  handleClick() {
    const newData = this.state.data.core.data[0].children.slice();
    newData.push({ text: "New child node" });
    this.setState({
      data: {
        core: {
          data: [
            {
              text: "Root node",
              children: newData,
            },
          ],
        },
      },
    });
  }

  handleChange(e, data) {
    this.setState({
      selected: data.selected,
    });
  }

  render() {
    const data = this.state.data;
    // console.log(data);
    return (
      <div>
        <button onClick={() => this.handleClick()}>Add node</button>
        <br />
        <br />
        <TreeView
          treeData={data}  
          onChange={(e, data) => this.handleChange(e, data)}
        />
        <br />
        <p>Selected nodes: {this.state.selected.join(", ")}</p>
      </div>
    );
  }
}
