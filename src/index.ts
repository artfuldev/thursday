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

  private _reorganize() {
    this._statistics = [];
    this._base_statistics.forEach(statistic => this.record(statistic));
  }

  private visited_units: Unit[] = [];

  private _deep_realize(unit1: Unit, unit2: Unit) {
    const visited_units = this.visited_units;
    const convert_down = Object.keys(this._conversions[unit2] || {}).filter(function(unit) { return unit !== unit1 && visited_units.indexOf(unit) === -1; });
    const current_conversions = Object.keys(this._conversions[unit1]);
    if (convert_down.every(function(unit) { return current_conversions.indexOf(unit) > -1; })) return;
    const factor = this._conversions[unit1][unit2];
    const realize = this._realize.bind(this);
    const conversions = this._conversions[unit2];
    convert_down.forEach(function (unit) { visited_units.push(unit); realize(unit1, [factor * conversions[unit], unit]); visited_units.pop(); });
  }

  private _realize(unit1: Unit, [value, unit2]: Measure, apply_reverse = true) {
    const conversions = this._conversions;
    if (!conversions[unit1]) conversions[unit1] = {};
    conversions[unit1][unit2] = value;
    this._deep_realize(unit1, unit2);
    if (apply_reverse) this._realize(unit2, [1/value, unit1], false);
  }
  
  realize(unit: Unit, [value, unit2]: Measure) {
    this._realize(unit, [value, unit2]);
    this._reorganize();
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
