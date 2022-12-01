import "pixi-projection";
import { Group } from "pixi-layers";
import * as PIXI from "pixi.js";

export class CardSprite extends PIXI.projection.Container3d {
  loader: PIXI.Loader;
  shadow: PIXI.projection.Sprite3d;
  inner: PIXI.projection.Container3d;
  back: PIXI.projection.Sprite3d;
  face: PIXI.projection.Container3d;
  code: number;
  showCode: number;
  tex: PIXI.ITextureDictionary;

  constructor(loaderResource: PIXI.LoaderResource, shadowGroup: Group, cardsGroup: Group) {
    super();

    PIXI.projection.Container3d.call(this);
    if (!loaderResource.textures) throw Error("No textures found!");
    this.tex = loaderResource.textures;

    this.shadow = new PIXI.projection.Sprite3d(this.tex["black.png"]);
    this.shadow.anchor.set(0.5);
    this.shadow.scale3d.x =
      this.shadow.scale3d.y =
      this.shadow.scale3d.z =
        0.98;
    this.shadow.alpha = 0.7;
  
    this.shadow.parentGroup = shadowGroup;
    this.inner = new PIXI.projection.Container3d();
    this.inner.parentGroup = cardsGroup;

    this.addChild(this.shadow);
    this.addChild(this.inner);

    this.back = new PIXI.projection.Sprite3d(this.tex["cover1.png"]);
    this.back.anchor.set(0.5);
    this.face = new PIXI.projection.Container3d();
    this.createFace();
    this.inner.addChild(this.back);
    this.inner.addChild(this.face);
    this.code = 0;
    this.showCode = -1;
    this.inner.euler.y = Math.PI;
    this.scale3d.x = this.scale3d.y = this.scale3d.z = 0.2;

  }

  createFace() {
    const sprite = new PIXI.projection.Sprite3d(this.tex["white1.png"]);
    const sprite2 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
    const sprite3 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
    const sprite4 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
    sprite2.y = -120;
    sprite2.x = -80;
    sprite3.y = 70;
    sprite3.x = 40;
    sprite4.y = -70;
    sprite4.x = -100;

    sprite.anchor.set(0.5);
    sprite2.anchor.set(0.5);
    sprite3.anchor.set(0.5);

    this.face.addChild(sprite);
    this.face.addChild(sprite2);
    this.face.addChild(sprite3);
    this.face.addChild(sprite4);

    this.updateFace();
  }

  updateFace() {
    let code = this.showCode === -1 ? 0 : this.showCode;
    let num = code & 0xf;
    let suit = code >> 4;
    const children = this.face.children as PIXI.projection.Sprite3d[];

    children[1].texture =
      num > 0 ? this.tex[(suit % 2) + "_" + num + ".png"] : PIXI.Texture.EMPTY;
    if (!children[1].texture) {
      console.log("FAIL 1 ", (suit % 2) + "_" + num + ".png");
    }
    children[2].texture =
      suit !== 0 ? this.tex[suit + "_big.png"] : PIXI.Texture.EMPTY;
    if (!children[2].texture) {
      console.log("FAIL 2", suit + "_big.png");
    }
    children[3].texture =
      suit !== 0 ? this.tex[suit + "_small.png"] : PIXI.Texture.EMPTY;
    if (!children[3].texture) {
      console.log("FAIL 3", suit + "_small.png");
    }
  }

  update(dt: number) {
    let inner = this.inner;
    if (this.code > 0 && inner.euler.y > 0) {
      inner.euler.y = Math.max(0, inner.euler.y - dt * 5);
    }
    if (this.code === 0 && inner.euler.y < Math.PI) {
      inner.euler.y = Math.min(Math.PI, inner.euler.y + dt * 5);
    }
    inner.position3d.z = -Math.sin(inner.euler.y) * this.back.width;
    this.shadow.euler = inner.euler;
  }

  depth() {
    return (this.inner.position3d.z || 0) * -1;
  }

  checkFace() {
    let inner = this.inner;
    let cc;

    if (!inner.isFrontFace()) {
      cc = 0;
    } else {
      cc = this.showCode || this.code;
    }
    if (cc === 0) {
      this.back.renderable = true;
      this.face.renderable = false;
    } else {
      this.back.renderable = false;
      this.face.renderable = true;
    }

    if (cc !== this.showCode) {
      this.showCode = cc;
      this.updateFace();
    }
  }
}
