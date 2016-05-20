import { CARDS_SHUFFLE, CARDS_MOVE_CARD, CARDS_SHOW_FACE, CARDS_CLICK, WOOD, IRON, SERF, STONE, GOLD } from '../constants';

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
};

const countResources = (arr) => (
  arr.reduce(
    (prev, item) => {
      if(item.resource){
        return Object.keys(item.resource).reduce(
          (prev, key) => ( { ...prev, [key]: prev[key] + item.resource[key] } ),
          prev
        );
      } else {
        return prev
      }
    },
    { wood: 0, stone: 0, iron: 0, serf: 0, gold: 0 }
  )
);

// return spare resources after deducting card cost or false if not enough resources are available
const isAffordable = (card, resources) => (
  Object.keys(card.cost).reduce(
    (spareResources, key) => {
      return spareResources &&
      (spareResources[key] - card.cost[key] >= 0) &&
      { ...spareResources, [key]: spareResources[key] - card.cost[key] }
    },
    Object.assign({}, resources )
  )
);

const updateAffordable = (supply, resources, extendAffordableBy, extendUnaffordableBy) => (
  supply.map( (stack) => {
    let lastCard = stack[stack.length-1];
    console.log("isAffordable", isAffordable(lastCard, resources) );
    return [
      ...stack.slice(0, stack.length-1),
      Object.assign( {}, lastCard, isAffordable(lastCard, resources) ? extendAffordableBy : extendUnaffordableBy)
    ];
  } )
);

const updateAffordableState = (state) => (
  {
    ...state,
    supply: updateAffordable(state.supply, countResources(state.hand), { highlighted: true }, { highlighted: false } )
  }
);

const cardClickHandlers = {
  hand: (state, key, index) => {
    console.log("cardClickHandlers hand", key, index);
    console.log( "countResources", countResources( state.hand ) );
    return {
      ...state,
      hand: [
        ...state.hand.slice(0,index),
        Object.assign( {}, state.hand[index], { selected: !state.hand[index].selected } ),
        ...state.hand.slice(index+1),
      ],
    }
  },
  supply: (state, key, index) => {
    // selecting a card to buy
    console.log("cardClickHandlers supply", key, index);
    console.log( "countResources", countResources( state.hand ) );
    // select cards from hand that will be used as a payment for the selected card
    return {
      ...state,
      supply: state.supply.map( (stack, stackIndex) => {
        let lastIndex = stack.length-1;
        let lastCard = stack[lastIndex];
        return [
          ...stack.slice(0, lastIndex),
          Object.assign(
            {},
            lastCard,
            (isAffordable(lastCard, countResources( state.hand ) ) && index === stackIndex + "-" + lastIndex) ?
            { selected: true, highlight: false } : { selected: false } )
        ]
      } ),
      hand: state.hand,
    }
  }
};

const cardTypes = {
  resources: {
    wood: {
      name: "Wood",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/20__17_27_37/wooden_beams_c_0000.jpgb887479b-935a-4f6e-b722-970544f474a0Original.jpg",
      type: "resource",
      resource: {
        [WOOD]: 1
      }
    },
    stone: {
      name: "Stone",
      graphics: "https://cdn1.artstation.com/p/assets/images/images/001/848/817/large/gavin-bartlett-gavinbartlett-rock-03-2016-render-01.jpg?1453684542",
      type: "resource",
      resource: {
        [STONE]: 1
      }
    },
    iron: {
      name: "Iron",
      graphics: "http://media-dominaria.cursecdn.com/attachments/143/922/635769989532453054.jpg",
      type: "resource",
      resource: {
        [IRON]: 1
      }
    },
    serf: {
      name: "Serf",
      graphics: "http://tes.riotpixels.com/skyrim/artwork/concept-a/large/NCostumeMF01.jpg",
      type: "resource",
      resource: {
        [SERF]: 1
      }
    },
    gold: {
      name: "Gold",
      graphics: "http://www.blirk.net/wallpapers/1600x1200/gold-wallpaper-4.jpg",
      type: "resource",
      resource: {
        [GOLD]: 1
      }
    }
  },
  lands: {
    forest: {
      name: "Forest",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/79/ff/22/79ff227b71cb7392013b50bb5eb77fa7.jpg",
      type: "land",
      tokenSlots: [{ type: SERF },{ type: SERF },{ type: SERF }],
      production: {
        type: WOOD,
        amount: 2
      }
    },
    plains: {
      name: "Plains",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/08/b3/3a/08b33ae668059df7fcfe14aa5dd1c57a.jpg",
      type: "land"
    },
    hills: {
      name: "Hills",
      graphics: "http://orig02.deviantart.net/0c14/f/2010/309/8/9/rocky_terrain_stock_3_by_mirandarose_stock-d328drk.jpg",
      type: "land",
      tokenSlots: [{ type: SERF },{ type: SERF },{ type: SERF }],
      production: {
        type: STONE,
        amount: 2
      }
    },
    mountains: {
      name: "Mountains",
      graphics: "http://www.movingmountainsministries.com/wp-content/uploads/2014/03/green-abstract-mountains-artwork-337347-21.jpg",
      type: "land",
      tokenSlots: [{ type: SERF },{ type: SERF },{ type: SERF }],
      production: {
        type: IRON,
        amount: 2
      }
    }
  },
  buildings: {
    "tower": {
      name: "Tower",
      type: "building",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/24__15_49_12/windowtower.jpge4dd1d20-d37b-495d-b178-d7b7ed020190HD.jpg",
      cost: { wood: 1, iron: 0, stone: 3, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "wall": {
      name: "Wall",
      type: "building",
      graphics: "http://preview.turbosquid.com/Preview/2015/03/30__21_06_04/S1.jpgdab93f66-4f4c-47a6-9c64-bb2c83c4da0cOriginal.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "living quarters": {
      name: "Living Quarters",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/45/32/41/453241e1d38ffdfcbcb439946775a40e.jpg",
      cost: { wood: 1, iron: 0, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "armory": {
      name: "Armory",
      type: "building",
      graphics: "http://orig13.deviantart.net/c8db/f/2015/002/c/a/armory_by_hfesbra-d8ca2pf.jpg",
      cost: { wood: 0, iron: 2, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "barracks": {
      name: "Barracks",
      type: "building",
      graphics: "http://www.florian-bruecher.de/portfolio/grafiken/props_wehrhaus02.jpg",
      cost: { wood: 1, iron: 1, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "hall": {
      name: "Hall",
      type: "building",
      graphics: "http://squarefaction.ru/files/game/744/gallery/fa1a798345789195acf615d5d9dc5329.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "blacksmith": {
      name: "Blacksmith",
      type: "building",
      graphics: "https://img-new.cgtrader.com/items/220210/large_medieval_village_blacksmith_3d_model_3ds_fbx_obj_blend_X__ms3d_b3d_3f114f8d-673b-4735-b9da-e0217b42198c.jpg",
      cost: { wood: 1, iron: 1, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "stables": {
      name: "Stables",
      type: "building",
      graphics: "http://www.3d-puzzlewelt.com/images_shop/product/mittelalter-pferdestall_umbum_4627081552141_1388_1.jpg",
      cost: { wood: 3, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "mine": {
      name: "Mine",
      type: "building",
      graphics: "https://enchantedamerica.files.wordpress.com/2014/09/florida-disneyland-seven-dwarfs-mine-train-rails.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "chapel": {
      name: "Chapel",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/06/17/3b/06173b7f2a158d87011c16a7b5cd8130.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "sawmill": {
      name: "Sawmill",
      type: "building",
      graphics: "http://img13.deviantart.net/7364/i/2012/056/2/5/old_sawmill_by_erebus74-d4qx60h.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "quarry": {
      name: "Quarry",
      type: "building",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/eb/66/d1/eb66d13d533b94a7bc02bbbd6f18e494.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: []
    },
    "marketplace": {
      name: "Marketplace",
      type: "building",
      graphics: "http://orig07.deviantart.net/a882/f/2012/235/b/4/medieval_market_by_minnhagen-d5c4fb5.jpg",
      cost: { wood: 1, iron: 1, stone: 1, gold: 1 },
      tokenSlots: [],
      labels: []

    },
  },
  units: {
    guards: {
      name: "Guards",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/e2/b0/fd/e2b0fdc1e407c9dbdec23f188d099b77.jpg",
      cost: { wood: 0, iron: 0, stone: 0, gold: 1  },
      move: 1,
      attack: 1,
      defense: 2,
    },
    marksmen: {
      name: "Marksmen",
      type: "unit",
      graphics: "http://img.photobucket.com/albums/v197/rakoth/paintings/ascheya.jpg",
      cost: { wood: 1, iron: 0, stone: 0, gold: 1 },
      move: 1,
      attack: 2,
      defense: 1
    },
    horsemen: {
      name: "Horsemen",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/f5/fe/af/f5feafd20859d47e1efb6ba4f1dd940f.jpg",
      cost: { wood: 1, iron: 1, stone: 0, gold: 2 },
      move: 2,
      attack: 2,
      defense: 2
    },
    bandits: {
      name: "Bandits",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/4c/09/76/4c09769c201f7cd256ddbeae462bf3ea.jpg",
      cost: { wood: 0, iron: 0, stone: 0, gold: 0 },
      move: 1,
      attack: 1,
      defense: 1
    },
    footman: {
      name: "Footman",
      type: "unit",
      graphics: "http://img03.deviantart.net/235b/i/2010/251/e/a/men_at_arms_concept_by_neilblade-d2ybvfn.jpg",
      cost: { wood: 0, iron: 0, stone: 0, gold: 0 },
      move: 1,
      attack: 2,
      defense: 2
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
  return updateAffordableState( ((state) => {
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
        return updateAffordableState(state);
    }
  })(state) );
}