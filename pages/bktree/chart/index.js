import React, { Component } from "react";
// import logo from "./logo.svg";
import "./tree.css";
// import BKDownshift from "./downshift/bkDownshift";

import wordList from "../lib/names";
import bkTree from "../lib/bkTree";
import Tree from "./tree";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomWords(list, count) {
  let words = [];
  while (words.length < count) {
    const spot = getRandomInt(0, list.length - 1);
    const word = list[spot];

    if (words.indexOf(word) === -1) {
      words.push(word);
    }
  }
  return words;
}

const selected = selected => {
  console.log(`selected: ${selected}!`);
};

/**
 * Generator function that creates ranges of numbers
 * given a start end and step.
 * This is just for fun.
 *
 * @param {number} start
 * @param {number} end
 * @param {number} [step=1]
 */
const range = function*(start, end, step = 1) {
  while (start <= end) {
    yield start;
    start += step;
  }
};

const distanceRange = [...range(0, 10)];
const resultLimit = [...range(5, 100, 5)];

class App extends Component {
  constructor(props) {
    super(props);

    // subtract 40 so that we always have at least 40 items in the tree
    let start = getRandomInt(0, wordList.length - 40);

    // get our list.
    this.randomList = wordList.slice(start, start + 40);

    // get a name to search for in our tree.
    // might as well use one that exists so we get a hit.
    const randomName = this.randomList[getRandomInt(0, 20)];

    this.tree = new bkTree(this.randomList.sort(), { details: true });

    this.state = {
      distance: 2,
      resultLimit: 20,
      name: randomName
    };
  }

  setDistance = event => {
    event.preventDefault();
    this.setState({
      distance: Number(event.target.value)
    });
  };

  setLimit = event => {
    event.preventDefault();
    this.setState({
      resultLimit: Number(event.target.value)
    });
  };

  setName = event => {
    event.preventDefault();
    this.setState({
      name: event.target.value
    });
  };

  render() {
    return (
      <div className="App">
        <label>Distance </label>
        <select value={this.state.distance} onChange={this.setDistance}>
          {distanceRange.map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <label>Result Limit </label>
        <select value={this.state.resultLimit} onChange={this.setLimit}>
          {resultLimit.map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <input value={this.state.name} onChange={this.setName} />
        <Tree
          tree={this.tree}
          word={this.state.name}
          distance={this.state.distance}
        />
      </div>
    );
  }
}

export default App;
