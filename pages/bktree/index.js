import React, { Component } from "react";
// import logo from "./logo.svg";
// import "./App.css";
import BKDownshift from "./bkDownshift";

import wordList from "./lib/names";
import bkTree from "./lib/bkTree";

const tree = new bkTree(wordList, { details: true });

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
  state = {
    distance: 2,
    resultLimit: 20
  };

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
        <BKDownshift
          bkTree={tree}
          selectCallBack={selected}
          distance={this.state.distance}
          resultLimit={this.state.resultLimit}
        />
      </div>
    );
  }
}

export default App;
