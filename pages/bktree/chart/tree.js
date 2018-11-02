import React from "react";
import * as d3 from "d3";
import { debounce } from "lodash";

export default class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.renderChart = this.renderChart.bind(this);
    this.unMountAndRender = debounce(this.unMountAndRender.bind(this), 500);
  }

  componentDidMount() {
    this.renderChart();
    this.props.tree.slowQuery(this.props.word, this.props.distance, 20);
  }

  componentDidUpdate() {
    this.unMountAndRender();
  }

  unMountAndRender() {
    d3.select("body")
      .select("svg")
      .remove();

    this.renderChart();
    this.props.tree.slowQuery(this.props.word, this.props.distance, 20);
  }

  renderChart() {
    // Set the dimensions and margins of the diagram
    var margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 1200 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var i = 0,
      duration = 750,
      root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(this.props.tree, function(d) {
      //console.log(d);
      if (d) {
        return Object.keys(d.children).map(key => {
          let data = d.children[key];
          data.distance = key;
          return data;
        });
      }
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // Collapse after the second level
    //root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    // function collapse(d) {
    //   if (d.children) {
    //     d._children = d.children;
    //     d._children.forEach(collapse);
    //     d.children = null;
    //   }
    // }

    function update(source) {
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) {
        d.y = d.depth * 180;
      });

      // ****************** Nodes section ***************************

      // Update the nodes...
      var node = svg.selectAll("g.node").data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + source.y0 + "," + source.x0 + ")";
        });
      // .on("click", click);

      // Add Circle for the nodes
      nodeEnter
        .append("circle")
        .attr("class", "node")
        .attr("id", function(d) {
          //console.log(d);
          if (d.data) {
            return d.data.term;
          }
        })
        .attr("r", 1e-6)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      // Add labels for the nodes
      nodeEnter
        .append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
          //console.log(d);
          if (d.data) {
            return d.data.term;
          }
        });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate
        // .transition()
        // .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      // Update the node attributes and style
      nodeUpdate
        .select("circle.node")
        .attr("r", 10)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        })
        .attr("cursor", "pointer");

      // Remove any exiting nodes
      var nodeExit = node
        .exit()
        // .transition()
        // .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select("circle").attr("r", 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select("text").style("fill-opacity", 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll("path.link").data(links, function(d) {
        return d.id;
      });

      // Enter any new links at the parent's previous position.
      var linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        //.attr("id",source.)
        .attr("d", function(d) {
          //console.log(source);
          var o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate
        // .transition()
        // .duration(duration)
        .attr("d", function(d) {
          return diagonal(d, d.parent);
        });

      //      Remove any exiting links
      link
        .exit()
        // .transition()
        // .duration(duration)
        .attr("d", function(d) {
          var o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      var text = svg.selectAll(".text-container").data(links, function(d) {
        //console.log(d);
        return d.id;
      });

      // Text Enter
      text
        .enter()
        .insert("g")
        .attr("class", "text-container")
        .append("text")
        .attr("class", "text")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("text-anchor", "middle")
        // .transition()
        // .duration(duration)
        .attr("transform", function(d) {
          return (
            "translate(" +
            (d.parent.y + d.y) / 2 +
            "," +
            (d.parent.x + d.x) / 2 +
            ")"
          );
        })
        .attr("dy", ".35em")
        .text(function(d) {
          return d.data.distance;
        });

      //   text.transition().duration(duration);
      // UPDATE

      // Update Text position for depth.
      text
        // .transition()
        // .duration(duration)
        .select(".text")
        .attr("transform", function(d) {
          return (
            "translate(" +
            (d.parent.y + d.y) / 2 +
            "," +
            (d.parent.x + d.x) / 2 +
            ")"
          );
        });

      text
        .exit()
        // .transition()
        .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        const path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`;

        return path;
      }

      //   // Toggle children on click.
      //   function click(d) {
      //     if (d.children) {
      //       d._children = d.children;
      //       d.children = null;
      //     } else {
      //       d.children = d._children;
      //       d._children = null;
      //     }
      //     update(d);
      //   }
    }
  }

  render() {
    return <div id="tree-container" ref={ref => (this.ref = ref)} />;
  }
}
