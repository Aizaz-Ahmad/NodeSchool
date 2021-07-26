const comparison = (operand_1, operator, operand_2, options) => {
  let operators = {
    //  {{#when <operand1> 'eq' <operand2>}}
    eq: (l, r) => l == r, //  {{/when}}
    noteq: (l, r) => l != r,
    gt: (l, r) => +l > +r, // {{#when var1 'eq' var2}}
    gteq: (l, r) => +l > +r || l == r, //               eq
    lt: (l, r) => +l < +r, // {{else when var1 'gt' var2}}
    lteq: (l, r) => +l < +r || l == r, //               gt
    or: (l, r) => l || r, // {{else}}
    and: (l, r) => l && r, //               lt
    '%': (l, r) => l % r === 0, // {{/when}}
  };
  let result = operators[operator](operand_1, operand_2);
  if (result) return options.fn(this);
  return options.inverse(this);
};

const statusBadge = status => {
  let className = 'warning';
  if (status === 'submitted') className = 'info';
  else if (status === 'rejected') className = 'danger';
  else if (status === 'approved') className = 'success';
  return `<span class='badge bg-${className} ms-3'>${String(
    status
  ).toUpperCase()}</span>`;
};

const applicationForm = (status, options) => {
  return status === 'not submitted' ? options.fn(this) : '';
};
/**
 * @param  {Date} date
 */
const DateToLocaleDate = date => date.toLocaleDateString();
const toUpperCase = str => str.toUpperCase();
module.exports = {
  when: comparison,
  statusBadge,
  applicationForm,
  DateToLocaleDate,
  toUpperCase,
};
