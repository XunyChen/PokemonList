export class StatsItem {
  base_stat = 0;
  effort = 0;
  stat = {
    name: "",
    url: "",
  };

  constructor(data) {
    if (data) {
      transformData(data, this);
    }
  }
}