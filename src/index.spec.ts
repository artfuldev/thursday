import { Thursday } from './';
import 'mocha';
import { expect } from 'chai';
import { Statistic } from './statistic';

describe('Thursday', () => {

  it('should retrieve no items when provided with no records', () => {
    const thursday = new Thursday();
    const results = thursday.retrieve(1);
    expect(results).to.be.an('array');
    expect(results).to.have.length(0);
  });

  it('should retrieve a matching record within tolerances', () => {
    const thursday = new Thursday();
    const value = 20;
    const unit = "steps taken";
    const description = "last week";
    const statistic: Statistic = [[value, unit], description];
    thursday.record(statistic);

    const test = (value: number, tolerance = 0.1) => {
      const results = thursday.retrieve(value, tolerance);
      expect(results).to.be.an('array');
      expect(results).to.have.length(1);
      const match = results[0];
      expect(match[0][0]).to.equal(value);
      expect(match[0][1]).to.equal(unit);
      expect(match[1]).to.equal(description);
    }

    test(value);
    test(value * 1.1);
    test(value * 0.91);
    test(value, .25);
    test(value * .75, .5);
  });
});
