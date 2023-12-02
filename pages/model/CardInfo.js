export const CARD_STATE = {
  LOADING: 0,
  FINISHED: 1,
  ERROR: 2,
}
export class CardInfo {
  id = 0;
  order = 0;
  name = "";
  url = "";
  index = 0;
  weight = 0;
  height = 0;
  sprites = {
    back_default: "",
    back_female: "",
    back_shiny: "",
    back_shiny_female: "",
    front_default: "",
    front_female: "",
    front_shiny: "",
    front_shiny_female: "",
  };
  stats = [];
  state = CARD_STATE.LOADING;
  backgroundColor = "";

  constructor(data) {
    Object.keys(this).forEach(key => {
      if (data[key] !== undefined) {
        this[key] = data[key];
      }
    })
  }
}