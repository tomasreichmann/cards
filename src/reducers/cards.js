import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK } from '../constants';

const shuffle = (arr) => {
  let unshuffled = arr.slice();
  let shuffled = [];
  while(unshuffled.length > 0){
    let randomIndex = Math.floor( Math.random()*unshuffled.length );
    let randomItem = shuffled.push( unshuffled[randomIndex] );
    unshuffled = [
      ...unshuffled.slice(0,randomIndex),
      ...unshuffled.slice(randomIndex+1)
    ];
  }
  return shuffled;
}

const updateLast = (arr, updateWith) => {
  return arr.map( (item, index) => (
    index === arr.length-1 ? Object.assign({}, item, updateWith) : item
  ) );
}

const cardClickHandlers = {
  hand: (state, key, index) => {
    console.log("cardClickHandlers hand", key, index);
    
    return {
      ...state,
      hand: [
        ...state.hand.slice(0,index),
        Object.assign( {}, state.hand[index], { selected: !state.hand[index].selected } ),
        ...state.hand.slice(index+1),
      ],
    }
  }
}

const cardTypes = {
  resources: {
    wood: {
      name: "Wood",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/20__17_27_37/wooden_beams_c_0000.jpgb887479b-935a-4f6e-b722-970544f474a0Original.jpg",
      type: "resource"
    },
    stone: {
      name: "Stone",
      graphics: "https://cdn1.artstation.com/p/assets/images/images/001/848/817/large/gavin-bartlett-gavinbartlett-rock-03-2016-render-01.jpg?1453684542",
      type: "resource"
    },
    iron: {
      name: "Iron",
      graphics: "http://media-dominaria.cursecdn.com/attachments/143/922/635769989532453054.jpg",
      type: "resource"
    },
    serf: {
      name: "Serf",
      graphics: "http://tes.riotpixels.com/skyrim/artwork/concept-a/large/NCostumeMF01.jpg",
      type: "resource"
    },
    gold: {
      name: "Gold",
      graphics: "http://www.blirk.net/wallpapers/1600x1200/gold-wallpaper-4.jpg",
      type: "resource"
    }
  },
  lands: {
    forest: {
      name: "Forest",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/79/ff/22/79ff227b71cb7392013b50bb5eb77fa7.jpg",
      type: "land"
    },
    plains: {
      name: "Plains",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/08/b3/3a/08b33ae668059df7fcfe14aa5dd1c57a.jpg",
      type: "land"
    },
    hills: {
      name: "Hills",
      graphics: "http://orig02.deviantart.net/0c14/f/2010/309/8/9/rocky_terrain_stock_3_by_mirandarose_stock-d328drk.jpg",
      type: "land"
    },
    mountains: {
      name: "Mountains",
      graphics: "http://www.movingmountainsministries.com/wp-content/uploads/2014/03/green-abstract-mountains-artwork-337347-21.jpg",
      type: "land"
    }
  },
  buildings: {
    "tower": {
      name: "Tower",
      type: "building",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/24__15_49_12/windowtower.jpge4dd1d20-d37b-495d-b178-d7b7ed020190HD.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "wall": {
      name: "Wall",
      type: "building",
      graphics: "http://preview.turbosquid.com/Preview/2015/03/30__21_06_04/S1.jpgdab93f66-4f4c-47a6-9c64-bb2c83c4da0cOriginal.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    // "gate": {
    //   name: "Gate",
    //   type: "building",
    //   cost: { wood: 0, iron: 0, stone: 0 },
    //   tokenSlots: [],
    //   labels: []
    // },
    "living quarters": {
      name: "Living Quarters",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/45/32/41/453241e1d38ffdfcbcb439946775a40e.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "armory": {
      name: "Armory",
      type: "building",
      graphics: "http://orig13.deviantart.net/c8db/f/2015/002/c/a/armory_by_hfesbra-d8ca2pf.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "barracks": {
      name: "Barracks",
      type: "building",
      graphics: "http://www.florian-bruecher.de/portfolio/grafiken/props_wehrhaus02.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "hall": {
      name: "Hall",
      type: "building",
      graphics: "http://squarefaction.ru/files/game/744/gallery/fa1a798345789195acf615d5d9dc5329.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "blacksmith": {
      name: "Blacksmith",
      type: "building",
      graphics: "https://img-new.cgtrader.com/items/220210/large_medieval_village_blacksmith_3d_model_3ds_fbx_obj_blend_X__ms3d_b3d_3f114f8d-673b-4735-b9da-e0217b42198c.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "stables": {
      name: "Stables",
      type: "building",
      graphics: "http://www.3d-puzzlewelt.com/images_shop/product/mittelalter-pferdestall_umbum_4627081552141_1388_1.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "mine": {
      name: "Mine",
      type: "building",
      graphics: "https://enchantedamerica.files.wordpress.com/2014/09/florida-disneyland-seven-dwarfs-mine-train-rails.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "chapel": {
      name: "Chapel",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/06/17/3b/06173b7f2a158d87011c16a7b5cd8130.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "sawmill": {
      name: "Sawmill",
      type: "building",
      graphics: "http://img13.deviantart.net/7364/i/2012/056/2/5/old_sawmill_by_erebus74-d4qx60h.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "quarry": {
      name: "Quarry",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/eb/66/d1/eb66d13d533b94a7bc02bbbd6f18e494.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []
    },
    "marketplace": {
      name: "Marketplace",
      type: "building",
      graphics: "http://orig07.deviantart.net/a882/f/2012/235/b/4/medieval_market_by_minnhagen-d5c4fb5.jpg",
      cost: { wood: 0, iron: 0, stone: 0 },
      tokenSlots: [],
      labels: []

    },
  },
  units: {
    guards: {
      name: "Guards",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    marksmen: {
      name: "Marksmen",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    horsemen: {
      name: "Horsemen",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    bandits: {
      name: "Bandits",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    },
    footman: {
      name: "Footman",
      type: "unit",
      cost: { wood: 0, iron: 0, stone: 0 }
    }
  }
};

const cardDecks = {
  "supply": [
    ...Object.keys(cardTypes.buildings).map( (key) => ( { card: cardTypes.buildings[key], amount: 10, stack: true } ) ),
    ...Object.keys(cardTypes.units).map( (key) => ( { card: cardTypes.units[key], amount: 10, stack: true } ) )
  ],
  "board": Object.keys(cardTypes.lands).map( (key) => ( { card: cardTypes.lands[key], amount: 3 } ) ),
  "resources": Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 20 } ) ),
  "hand": Object.keys(cardTypes.resources).map( (key) => ( { card: cardTypes.resources[key], amount: 2, extendBy: { hover: true } } ) ),
};

const deckFactory = () => (
  Object.keys(cardDecks).reduce( (prev, key) => (
    Object.assign({}, prev,
      { // deck key
        [key]: cardDecks[key].reduce( (prev, item) => {
          let cards = [];
          for (var i = 0 ; i < item.amount ; i++) {
            cards.push( Object.assign({}, item.card, item.extendBy));
          }
          return item.stack ? [
            ...prev,
            cards
          ] : [
            ...prev,
            ...cards
          ]
        }, [] )
      }
    )
  ) , {})
);


const decks = deckFactory();

decks.board = shuffle(decks.board);
decks.supply = decks.supply.map( (item, index) => (
  updateLast( item, { hover: true } )
) );

// console.log("decks", decks.supply);

export default function cards(state = decks, action) {
  switch (action.type) {
    case CARDS_CLICK:
    let key = action.payload.key;
      console.log(CARDS_CLICK, action.payload);
      return key in cardClickHandlers ? cardClickHandlers[key](state, key, action.payload.index) : state;

    case CARDS_SHUFFLE:
      return {
        ...state,
        [action.payload]: shuffle( state[action.payload] ),
      };

    case CARDS_MOVE_CARD:
      return {
        ...state,
        [action.payload.from]: [
          ...state[action.payload.from].slice(0, action.payload.index),
          ...state[action.payload.from].slice(action.payload.index+1)
        ],
        [action.payload.to]: [
          ...state[action.payload.to],
          state[action.payload.from][action.payload.index]
        ],
      };

    case CARDS_SHOW_FACE:
      let index = action.payload.key;
      return {
        ...state,
        [action.payload.key]: state[action.payload.key].map( (item) => ( {
          ...item,
          faceUp: action.payload.faceUp
        } ) ),
      };

    default:
      return state;
  }
}