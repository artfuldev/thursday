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

  it('should add conversions', () => {
    const thursday = new Thursday();
    const value = 20;
    const unit = "minutes";
    const description = "spent";
    const statistic: Statistic = [[value, unit], description];
    thursday.realize("minutes", [60, "seconds"]);
    thursday.record(statistic);

    const results = thursday.retrieve(1200);
    expect(results).to.be.an('array');
    expect(results).to.have.length(1);
    const match = results[0];
    expect(match[0][0]).to.equal(1200);
    expect(match[0][1]).to.equal("seconds");
    expect(match[1]).to.equal(description);
  });

  it('should add deeper conversions', () => {
    const thursday = new Thursday();
    const value = 20;
    const unit = "minutes";
    const description = "spent";
    const statistic: Statistic = [[value, unit], description];
    const realizations: any = [
      ["decades", [10, "years"]],
      ["years", [365, "days"]],
      ["years", [12, "months"]],
      ["months", [30, "days"]],
      ["weeks", [7, "days"]],
      ["days", [24, "hours"]],
      ["hours", [60, "minutes"]],
      ["minutes", [60, "seconds"]],
      ["seconds", [1000, "milliseconds"]],
      ["milliseconds", [1000, "microseconds"]],
      ["microseconds", [1000, "nanoseconds"]],
      ["nanoseconds", [1000, "picoseconds"]]
    ];
    realizations.forEach(function (realization: any) { thursday.realize(realization[0], realization[1]) });
    thursday.record(statistic);

    const results = thursday.retrieve(1200000000);
    expect(results).to.be.an('array');
    expect(results).to.have.length(1);
    const match = results[0];
    expect(match[0][0]).to.equal(1200000000);
    expect(match[0][1]).to.equal("microseconds");
    expect(match[1]).to.equal(description);
  });
});
