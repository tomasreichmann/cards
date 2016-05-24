import { WOOD, IRON, SERF, STONE, GOLD } from '../constants';
export default {
  resources: {
    wood: {
      card: "wood",
      name: "Wood",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/20__17_27_37/wooden_beams_c_0000.jpgb887479b-935a-4f6e-b722-970544f474a0Original.jpg",
      type: "resource",
      resource: {
        [WOOD]: 1
      }
    },
    stone: {
      card: "stone",
      name: "Stone",
      graphics: "https://cdn1.artstation.com/p/assets/images/images/001/848/817/large/gavin-bartlett-gavinbartlett-rock-03-2016-render-01.jpg?1453684542",
      type: "resource",
      resource: {
        [STONE]: 1
      }
    },
    iron: {
      card: "iron",
      name: "Iron",
      graphics: "http://media-dominaria.cursecdn.com/attachments/143/922/635769989532453054.jpg",
      type: "resource",
      resource: {
        [IRON]: 1
      }
    },
    gold: {
      card: "gold",
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
      card: "forest",
      name: "Forest",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/79/ff/22/79ff227b71cb7392013b50bb5eb77fa7.jpg",
      type: "land",
      tokenSlots: [],
      production: {
        type: WOOD,
        amount: 2
      }
    },
    plains: {
      card: "plains",
      name: "Plains",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/08/b3/3a/08b33ae668059df7fcfe14aa5dd1c57a.jpg",
      type: "land"
    },
    hills: {
      card: "hills",
      name: "Hills",
      graphics: "http://orig02.deviantart.net/0c14/f/2010/309/8/9/rocky_terrain_stock_3_by_mirandarose_stock-d328drk.jpg",
      type: "land",
      tokenSlots: [],
      production: {
        type: STONE,
        amount: 2
      }
    },
    mountains: {
      card: "mountains",
      name: "Mountains",
      graphics: "http://www.movingmountainsministries.com/wp-content/uploads/2014/03/green-abstract-mountains-artwork-337347-21.jpg",
      type: "land",
      tokenSlots: [],
      production: {
        type: IRON,
        amount: 2
      }
    }
  },
  buildings: {
    "tower": {
      card: "tower",
      name: "Tower",
      type: "building",
      subType: "defensive",
      graphics: "http://preview.turbosquid.com/Preview/2014/05/24__15_49_12/windowtower.jpge4dd1d20-d37b-495d-b178-d7b7ed020190HD.jpg",
      cost: { wood: 1, iron: 0, stone: 3, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { card: "tower" } ],
    },
    "wall": {
      card: "wall",
      name: "Wall",
      type: "building",
      subType: "defensive",
      graphics: "http://preview.turbosquid.com/Preview/2015/03/30__21_06_04/S1.jpgdab93f66-4f4c-47a6-9c64-bb2c83c4da0cOriginal.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { card: "wall" } ],
    },
    "living quarters": {
      card: "living",
      name: "Living Quarters",
      type: "building",
      subType: "noble",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/45/32/41/453241e1d38ffdfcbcb439946775a40e.jpg",
      cost: { wood: 1, iron: 0, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "noble" } ],
    },
    "armory": {
      card: "armory",
      name: "Armory",
      type: "building",
      subType: "military",
      graphics: "http://orig13.deviantart.net/c8db/f/2015/002/c/a/armory_by_hfesbra-d8ca2pf.jpg",
      cost: { wood: 0, iron: 2, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "military" } ],
    },
    "barracks": {
      card: "barracks",
      name: "Barracks",
      type: "building",
      subType: "military",
      graphics: "http://www.florian-bruecher.de/portfolio/grafiken/props_wehrhaus02.jpg",
      cost: { wood: 1, iron: 1, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "military" } ],
    },
    "hall": {
      card: "hall",
      name: "Hall",
      type: "building",
      subType: "noble",
      graphics: "http://squarefaction.ru/files/game/744/gallery/fa1a798345789195acf615d5d9dc5329.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" } ],
    },
    "blacksmith": {
      card: "blacksmith",
      name: "Blacksmith",
      type: "building",
      subType: "commoner",
      graphics: "https://img-new.cgtrader.com/items/220210/large_medieval_village_blacksmith_3d_model_3ds_fbx_obj_blend_X__ms3d_b3d_3f114f8d-673b-4735-b9da-e0217b42198c.jpg",
      cost: { wood: 1, iron: 1, stone: 1, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "commoner" } ],
    },
    "stables": {
      card: "stables",
      name: "Stables",
      type: "building",
      subType: "military",
      graphics: "http://www.3d-puzzlewelt.com/images_shop/product/mittelalter-pferdestall_umbum_4627081552141_1388_1.jpg",
      cost: { wood: 3, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" } ],
    },
    "mine": {
      card: "mine",
      name: "Mine",
      type: "building",
      subType: "production",
      graphics: "https://enchantedamerica.files.wordpress.com/2014/09/florida-disneyland-seven-dwarfs-mine-train-rails.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { card: "mountains" } ],
    },
    "chapel": {
      card: "chapel",
      name: "Chapel",
      type: "building",
      subType: "noble",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/06/17/3b/06173b7f2a158d87011c16a7b5cd8130.jpg",
      cost: { wood: 0, iron: 0, stone: 2, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "noble" } ],
    },
    "sawmill": {
      card: "sawmill",
      name: "Sawmill",
      type: "building",
      subType: "production",
      graphics: "http://img13.deviantart.net/7364/i/2012/056/2/5/old_sawmill_by_erebus74-d4qx60h.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { card: "forest" } ],
    },
    "quarry": {
      card: "quarry",
      name: "Quarry",
      type: "building",
      subType: "production",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/eb/66/d1/eb66d13d533b94a7bc02bbbd6f18e494.jpg",
      cost: { wood: 2, iron: 0, stone: 0, gold: 0 },
      tokenSlots: [],
      labels: [],
      placement: [ { card: "hills" } ],
    },
    "marketplace": {
      card: "marketplace",
      name: "Marketplace",
      type: "building",
      subType: "commoner",
      graphics: "http://orig07.deviantart.net/a882/f/2012/235/b/4/medieval_market_by_minnhagen-d5c4fb5.jpg",
      cost: { wood: 1, iron: 1, stone: 1, gold: 1 },
      tokenSlots: [],
      labels: [],
      placement: [ { type: "land" }, { subType: "commoner" } ],
    },
  },
  units: {
    guards: {
      card: "guards",
      name: "Guards",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/e2/b0/fd/e2b0fdc1e407c9dbdec23f188d099b77.jpg",
      cost: { wood: 0, iron: 1, stone: 0, gold: 1  },
      move: 1,
      attack: 1,
      defense: 2,
      placement: [ { subType: "military" } ],
    },
    marksmen: {
      card: "marksmen",
      name: "Marksmen",
      type: "unit",
      graphics: "http://img.photobucket.com/albums/v197/rakoth/paintings/ascheya.jpg",
      cost: { wood: 1, iron: 0, stone: 0, gold: 1 },
      move: 1,
      attack: 2,
      defense: 1,
      placement: [ { subType: "military" } ],
    },
    horsemen: {
      card: "horsemen",
      name: "Horsemen",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/f5/fe/af/f5feafd20859d47e1efb6ba4f1dd940f.jpg",
      cost: { wood: 1, iron: 1, stone: 0, gold: 2 },
      move: 2,
      attack: 2,
      defense: 2,
      placement: [ { subType: "military" } ],
    },
    bandits: {
      card: "bandits",
      name: "Bandits",
      type: "unit",
      graphics: "https://s-media-cache-ak0.pinimg.com/736x/4c/09/76/4c09769c201f7cd256ddbeae462bf3ea.jpg",
      cost: { wood: 0, iron: 0, stone: 0, gold: 0 },
      move: 1,
      attack: 1,
      defense: 1,
    },
    footman: {
      card: "footman",
      name: "Footman",
      type: "unit",
      graphics: "http://img03.deviantart.net/235b/i/2010/251/e/a/men_at_arms_concept_by_neilblade-d2ybvfn.jpg",
      cost: { wood: 0, iron: 0, stone: 0, gold: 0 },
      move: 1,
      attack: 2,
      defense: 2,
    },
    serf: {
      card: "serf",
      name: "Serf",
      graphics: "http://tes.riotpixels.com/skyrim/artwork/concept-a/large/NCostumeMF01.jpg",
      type: "unit",
      subType: "serf",
      cost: { wood: 0, iron: 0, stone: 0, gold: 1 },
      move: 2,
      attack: 0,
      defense: 0,
    },
  }
};