import { Stage } from 'pixi-layers';
import * as PIXI from 'pixi.js';
import { Cards } from './Cards';

let app = new PIXI.Application({ 
  width: 800, height: 600, autoStart: false, antialias: true
});
document.body.appendChild(app.view);
app.stage = new Stage();

let loader = PIXI.Loader.shared;

let camera = new PIXI.projection.Camera3d();
camera.position.set(app.screen.width / 2, app.screen.height / 2);
camera.setPlanes(350, 30, 10000);
camera.euler.x = Math.PI / 5.5;
app.stage.addChild(camera);

loader.add('cards', 'assets/cards.json');
loader.add('table', 'assets/table.png');

loader.load((_loader, resources) => {
  app.stage.addChildAt(new PIXI.Sprite(resources.table?.texture), 0);
  app.start();
  if (!resources.cards) throw Error("Cards.json not found");
  let cards = new Cards(camera, resources.cards);
  app.ticker.add(cards.update);
});
