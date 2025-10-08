import React from 'react';
import { Activity } from 'react';

console.log('ESM import test:');
console.log('React.Activity:', React.Activity);
console.log('Named import Activity:', Activity);
console.log('Type:', typeof Activity);
console.log('Creating element:', React.createElement(Activity, { mode: 'visible' }, 'test'));
