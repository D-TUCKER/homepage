import React from "react";
import {
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryAxis
} from "victory";
import regression from "regression";
import "./chart.css";

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    const [data, pointArray] = this._randomPoints(10);

    this.state = {
      data: data,
      pointArray: pointArray
    };
  }

  render() {
    return (
      <div>
        <h1>Data Visualization</h1>
        <h3>Random points + Polynomial regression.</h3>
        <div className="chart-container">
          <div className="chart-item">
            <Linear pointArray={this.state.pointArray} data={this.state.data} />
          </div>
          <div className="chart-item">
            <Poly2 pointArray={this.state.pointArray} data={this.state.data} />
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-item">
            <Poly3 pointArray={this.state.pointArray} data={this.state.data} />
          </div>
          <div className="chart-item">
            <Poly4 pointArray={this.state.pointArray} data={this.state.data} />
          </div>
        </div>
      </div>
    );
  }

  _randomPoints = count => {
    let points = [];
    let pointArray = [];

    while (count > 0) {
      count--;
      //const x = random(0, 10);
      const x = count;
      const y = random(0, 10);
      pointArray.push([x, y]);
      points.push({ x: x, y: y });
    }

    return [points, pointArray];
  };

  _clearRefreshTimer = () => {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
    }
  };

  componentDidMount() {
    this._refreshTimer = setInterval(() => {
      const [data, pointArray] = this._randomPoints(10);
      this.setState({
        data: data,
        pointArray: pointArray
      });
    }, 5000);
  }

  componentWillUnmount() {
    this._clearRefreshTimer();
  }
}

const Linear = ({ data, pointArray }) => {
  const { equation, string, points } = regression.linear(pointArray);
  const [slope, intercept] = equation;
  const graph = data => intercept + slope * data.x;

  return <Chart data={data} points={points} string={string} graph={graph} />;
};

const Poly2 = ({ data, pointArray }) => {
  const { equation, string, points } = regression.polynomial(pointArray, {
    order: 2
  });
  const a = equation;
  const graph = data => a[2] + a[1] * data.x + a[0] * Math.pow(data.x, 2);

  return <Chart data={data} points={points} string={string} graph={graph} />;
};

const Poly3 = ({ data, pointArray }) => {
  const { equation, string, points } = regression.polynomial(pointArray, {
    order: 3
  });
  const a = equation;
  const graph = data =>
    a[3] +
    a[2] * data.x +
    a[1] * Math.pow(data.x, 2) +
    a[0] * Math.pow(data.x, 3);

  return <Chart data={data} points={points} string={string} graph={graph} />;
};

const Poly4 = ({ data, pointArray }) => {
  const { equation, string, points } = regression.polynomial(pointArray, {
    order: 4
  });
  const a = equation;
  const graph = data =>
    a[4] +
    a[3] * data.x +
    a[2] * Math.pow(data.x, 2) +
    a[1] * Math.pow(data.x, 3) +
    a[0] * Math.pow(data.x, 4);

  return <Chart data={data} points={points} string={string} graph={graph} />;
};

const Chart = ({ data, points, string, graph }) => {
  const delta = data.map((pointA, index) => (
    <VictoryLine
      key={index}
      style={{
        data: {
          strokeWidth: 3,
          stroke: pointA.y > points[index][1] ? "red" : "blue"
        }
      }}
      animate={{ velocity: 0.2 }}
      data={[pointA, { x: points[index][0], y: points[index][1] }]}
    />
  ));

  return (
    <VictoryChart>
      <VictoryAxis label={string} />
      <VictoryLine animate={{ velocity: 0.2 }} y={graph} />
      {delta}
      <VictoryScatter animate={{ velocity: 0.2 }} data={data} size={5} />
    </VictoryChart>
  );
};

export default Home;
