// Addapted from https://github.com/tjbaron/node-bktree/blob/master/lib/bktree.js
// @ts-check
import damlev from "damlev";

class bkTree {
  /**
   * Creates an instance of bkTree.
   * @param {string[]|string} term 
   * @param {object} options 
   * @memberof bkTree
   */
  constructor(term, options) {
    this.addTerms = this.addTerms.bind(this);
    this._addTerm = this._addTerm.bind(this);
    this.query = this.query.bind(this);
    this._query = this._query.bind(this);

    options = options || {};
    this.stringCompare = damlev;
    this.options = options;

    // We pass the Array of words initially.
    if (Array.isArray(term)) {
      // Last word in our list is the root.
      let tree = new bkTree(term.pop(), this.options);
      // run add terms on the rest.
      tree.addTerms(term);
      return tree;
    }
    this.term = term;
    this.children = {};
  }
  /**
 * Add an array of terms to the tree.
 * 
 * @param {string[]} newTerms 
 * @memberof bkTree
 */
  addTerms(newTerms) {
    newTerms.forEach(term => this._addTerm(term));
  }
  /**
 * Recurse through and add children
 * 
 * @param {string} newTerm 
 * @memberof bkTree
 */
  _addTerm(newTerm) {
    // Get the distance between the words
    const dist = this.stringCompare(this.term, newTerm);
    // Check if distance exists already. Otherwise make a new tree.
    if (this.children[dist]) {
      this.children[dist]._addTerm(newTerm);
    } else {
      this.children[dist] = new bkTree(newTerm, this.options);
    }
  }
  /**
 * 
 * Returns an array of matching results given a
 * string, distance and max number of results.
 * 
 * @param {string} queryTerm 
 * @param {number} maxDist 
 * @param {number} [max=null] 
 * @returns {object[]|string[]}
 * @memberof bkTree
 */
  query(queryTerm, maxDist, max = null) {

    // this is mutated by this.query, which is kind of ugly.
    let tempResults = [];

    this._query(queryTerm, maxDist, null, tempResults);

    tempResults.sort((a, b) => a.dist - b.dist);

    let results = [];
    let len = tempResults.length;
    if (null !== max) {
      len = Math.min(max, tempResults.length);
    }
    for (let i = 0; i < len; ++i) {
      results.push(this.options.details ? tempResults[i] : tempResults[i].t);
    }
    return results;
  }
  /**
 * Recurses throught the bk tree finding matches 
 * within the max distance. 
 * 
 * @param {string} queryTerm 
 * @param {number} maxDist 
 * @param {number} d 
 * @param {object[]} results 
 * @memberof bkTree
 */
  _query(queryTerm, maxDist, d, results) {
    const dist = this.stringCompare(this.term, queryTerm);

    if (dist <= maxDist) {
      results.push({ term: this.term, dist });
    }

    if (null === d) {
      d = dist;
    }

    const min = dist - maxDist;
    const max = dist + maxDist;

    for (let i = min; i <= max; ++i) {
      if (this.children[i]) {
        this.children[i]._query(queryTerm, maxDist, d, results);
      }
    }
  }
}

export default bkTree;
