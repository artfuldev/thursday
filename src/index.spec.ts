import { Thursday } from './';
import 'mocha';
import { expect } from 'chai';

describe('Thursday', () => {

  it('should retrieve no items when provided with no records', () => {
    const thursday = new Thursday();
    const results = thursday.retrieve(1);
    expect(results).to.be.an('array');
    expect(results).to.have.length(0);
  });
});
