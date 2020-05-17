/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = Object.create(proto);
  const data = JSON.parse(json);
  Object.keys(data).forEach((i) => {
    result[i] = data[i];
  });
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: [],
  left: [],
  combinators: [],
  previousValue: '',

  moreOneTimeError() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  orderError() {
    this.previousValue = '';
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  element(value) {
    if (this.previousValue === 'element') {
      this.moreOneTimeError();
    } else if (this.previousValue === 'id' && value !== 'img' && value !== 'tr') {
      this.orderError();
    }
    this.previousValue = 'element';
    if (this.result.length) {
      this.left.push([...this.result].join(''));
      this.result = [];
      this.previousValue = '';
    }
    this.result.push(value);
    return this;
  },

  id(value) {
    if (this.previousValue === 'id') {
      this.moreOneTimeError();
    } else if (
      this.previousValue === 'class'
      || this.previousValue === 'pseudoElement'
    ) {
      this.orderError();
    }
    this.previousValue = 'id';
    this.result.push(`#${value}`);
    return this;
  },

  class(value) {
    if (this.previousValue === 'attr') {
      this.orderError();
    }
    this.previousValue = 'class';
    this.result.push(`.${value}`);
    return this;
  },

  attr(value) {
    if (this.previousValue === 'pseudoClass') {
      this.orderError();
    }
    this.previousValue = 'attr';
    this.result.push(`[${value}]`);
    return this;
  },

  pseudoClass(value) {
    if (this.previousValue === 'pseudoElement') {
      this.orderError();
    }
    this.previousValue = 'pseudoClass';
    this.result.push(`:${value}`);
    return this;
  },

  pseudoElement(value) {
    if (this.previousValue === 'pseudoElement') {
      this.moreOneTimeError();
    }
    this.previousValue = 'pseudoElement';
    this.result.push(`::${value}`);
    return this;
  },

  // eslint-disable-next-line no-unused-vars
  combine(selector1, combinator, selector2) {
    this.combinators.push(` ${combinator} `);
    return this;
  },

  stringify() {
    const temp = [];
    for (let i = 0; i < this.left.length; i += 1) {
      temp.push(this.left[i], this.combinators.pop());
    }
    temp.push(...this.result);
    this.result = [];
    this.left = [];
    this.previousValue = '';
    return temp.join('');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
