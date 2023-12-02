import { CardInfo } from "./CardInfo";

export class PageData {
  count = 0;
  next = "";
  previous = "";
  results = [];
  lastIndex = null;

  constructor(data) {
    if (data) {
      this.count = data.count;
      this.next = data.next;
      this.previous = data.previous;

      const list = data.results;
      if (list && Array.isArray(list)) {
        this.concatList(list);
        this.lastIndex = list.length - 1
      }
    }
  }

  concatList(data) {
    if (data && Array.isArray(data)) {
      const list = data.map((item, index) => {
        if (this.lastIndex !== null) {
          return new CardInfo({
            index: ++this.lastIndex,
            ...item, 
          });
        }
        return new CardInfo({
          index,
          ...item
        })
      })
      this.results = [...this.results, ...list];
    }
  }
}
