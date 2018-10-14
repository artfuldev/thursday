import { Unit } from './unit';
import { Measure } from './measure';
import { Statistic } from './statistic';

export class Thursday {
  private _conversions: { [x: string]: { [y: string]: number } };
  private _base_statistics: Statistic[];
  private _statistics: Statistic[];

  constructor() {
    this._base_statistics = [];
    this._statistics = [];
    this._conversions = {};
  }

  private reorganize() {
    this._statistics = [];
    this._base_statistics.forEach(statistic => this.record(statistic));
  }
  
  realize(unit: Unit, [value, unit2]: Measure) {
    const conversions = this._conversions;
    if (!conversions[unit]) conversions[unit] = {};
    if (!conversions[unit2]) conversions[unit2] = {};
    conversions[unit][unit2] = value;
    conversions[unit2][unit] = value;
    this.reorganize();
  }

  record([[value, unit], description]: Statistic) {
    this._base_statistics.push([[value, unit], description]);
    this._statistics.push([[value, unit], description]);
    if (!this._conversions[unit]) return;
    const factors = this._conversions[unit];
    for (var unit in factors) {
      var factor = factors[unit];
      this._statistics.push([[factor*value, unit], description]);
    }
  }

  retrieve(value: number, tolerance = 0.10) {
    const lower_bound = value * (1 - tolerance);
    const upper_bound = value * (1 + tolerance);
    return this._statistics
      .filter(([[value, _], __]) => value >= lower_bound && value <= upper_bound)
      .map<Statistic>(([[_, unit], description]) => [[value, unit], description]);
  }
};
