import { Group, Layer } from "pixi-layers";
import { CardSprite } from "./CardSprite";
import * as PIXI from "pixi.js";

export class Cards {
  cards = new PIXI.projection.Container3d();
  cardResource: PIXI.LoaderResource;
  shadowGroup: Group;
  cardsGroup: Group;
  camera: PIXI.projection.Camera3d;

  constructor(camera: PIXI.projection.Camera3d, cardResource: PIXI.LoaderResource) {
    this.camera = camera;
    this.cardResource = cardResource;
    this.cards.position3d.y = -50;
    this.cards.scale3d.x = this.cards.scale3d.y = this.cards.scale3d.z = 1.5;
    camera.addChild(this.cards);
    this.shadowGroup = new Group(1, false);
    this.cardsGroup = new Group(2, (item) => {
      item.zOrder = item.parent.depth();
      item.parent.checkFace();
    });
    this.cardsGroup.enableSort = true;
    this.camera.addChild(new Layer(this.shadowGroup));
    this.camera.addChild(new Layer(this.cardsGroup));
    this.dealHand();
  }

  dealHand = () => {
    this.cards.removeChildren();
    for (var i = 0; i < 5; i++) {
      const card = new CardSprite(this.cardResource, this.shadowGroup, this.cardsGroup);
      card.position3d.x = 56 * (i - 2);
      card.update(0);
      card.interactive = true;
      card.on("mouseup", this.onClick);
      card.on("touchend", this.onClick);
      this.cards.addChild(card);
    }
  }

  onClick = (event: Event) => {
    let target = event.target as any as { code: number };
    if (target.code === 0) {
      const num = ((Math.random() * 13) | 0) + 2;
      const suit = ((Math.random() * 4) | 0) + 1;
      target.code = suit * 16 + num;
    } else {
      target.code = 0;
    }
  }

  update = (deltaTime: number) => {
      for (let i = 0; i < this.cards.children.length; i++) {
        (this.cards.children[i] as CardSprite).update(deltaTime / 60.0);
      }
      this.camera.updateTransform();
  }
}
