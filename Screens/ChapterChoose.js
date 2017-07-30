import Screen from '../Core/Screen';
import cfg from '../Assets/Chapters.json';
import GUI from '../GUI/GUI';
import Utils from '../Core/Utils';
import * as PIXI from 'pixi.js';
    
/**
 * Chapter choosing screen.
 * @class
 * @extends Screen
 */
class ChapterChoose extends Screen{

    constructor(){
        super();

        this._small = window.innerWidth <= 640 ? 2 : 1;
        this._buttonPressedDown = false;
        this._displacementmap = PIXI.Sprite.fromImage("Assets/Gfx/displacement_map.png");
        this._displacementmap.r = 1;
        this._displacementmap.g = 1;
        this._displacement = new PIXI.filters.DisplacementFilter(this._displacementmap);
        this._displacement.scale.x = 1.5;
        this._displacement.scale.y = 2;
        this._displacement.offset = {
            x: 0,
            y: 0
        };

        this._chapters = cfg;
        this._chaptersPositions = [];
        for(let i = 0; i < 2; i++){
            for(var j = 0; j < 3; j++){
                this._chaptersPositions.push({x: 300 * (j + 1), y: 200 * (i + 1)});
            }
        }

        this._chapters.forEach((chapter, index) => {
            this._guiStage.add(
                new GUI.Button(
                    chapter.name,
                    this._chaptersPositions[index],
                    PIXI.loader.resources.sprites.textures[chapter.sprite],
                    "",
                    index === 0 ? {active: true} : {},
                    () => {
                        this._onUpdateAction = "CHANGE";
                        this._nextScreen = "level_choose";
                        this._nextScreenParams = {
                            cfg: chapter.levels
                        };
                    }
                )
            );
            this._guiStage.add(
                new GUI.Label(
                    chapter.name + '_label',
                    {
                        x: this._chaptersPositions[index].x - 158,
                        y: this._chaptersPositions[index].y + 120
                    },
                    chapter.name,
                    {bitmap: true, fontSize: 20 / this._small, fontFamily: "Cyberdyne Expanded", fill: 0xffffff, align: "center"}
                )
            )
        });
        this._stage.add(this._guiStage);
        this._stage.add(this._background);
    }

    everythingLoaded(){
        this._guiStage.getElement("RETURN").setCallback(
            () => {
                this._onUpdateAction = "CHANGE";
                this._nextScreen = "menu";
            }
        );
    }

    /**
     * Method that handles user input and returns information to the application logic.
     */
    update(keysState, clicks, touches){

        var i = 0,j = 0, temp;
        //Keyboard handling
        if(keysState.ARROW_DOWN || keysState.S){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i != 2){
                    if(j == this._guiStage._elements.length){
                        j = 0;
                    }
                    temp = this._guiStage._elements[j];
                    if(temp !== undefined && temp !== null && temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
                        i = 1;
                        j+=1;
                        continue;
                    }
                    if(i == 1 && temp !== null && temp !== undefined && temp.isEnabled()){
                        temp._data.active = true;
                        i = 2;
                    }
                    else{
                        j+=1;
                    }
                }
            }
        }
        
        if(keysState.ARROW_UP || keysState.W){
            if(this._buttonPressedDown === false){
                this._buttonPressedDown = true;
                while(i != 2){
                    if(j == -1){
                        j = this._guiStage._elements.length - 1;
                    }
                    temp = this._guiStage._elements[j];
                    if(temp !== undefined && temp !== null && temp.isEnabled() && temp.isActive()){
                        temp._data.active = false;
                        temp._sprite.filters = null;
                        i = 1;
                        j-=1;
                        continue;
                    }
                    if(i == 1 && temp !== undefined && temp !== null && temp.isEnabled()){
                        temp._data.active = true;
                        i = 2;
                    }
                    else{
                        j-=1;
                    }
                }
            }
        }
        
        if(keysState.ENTER){
            this._guiStage._elements.forEach(element => {
                if(element && element.isActive()) element.triggerCallback();
            });
        }
        
        if(!keysState.ARROW_DOWN && !keysState.S && !keysState.ARROW_UP && !keysState.W){
            this._buttonPressedDown = false;
        }
        
        clicks.forEach(click => {
            this._guiStage._elements.forEach(element => {
                if(element.triggerCallback && element._sprite.containsPoint({x: click.clientX, y: click.clientY}))
                    element.triggerCallback();
            });
        });
        
        if(Utils.isTouchDevice()){
            touches.forEach(touch => {
                this._guiStage._elements.forEach(element => {
                    if(element.triggerCallback && element._sprite.containsPoint({x: touch.pageX, y: touch.pageY}))
                        element.triggerCallback();
                });
            });
        }

        this._guiStage._elements.forEach(element => {
            if(element.isEnabled() && element.isActive()){
                if(this._displacement.scale.y < 6){
                    this._displacement.scale.y += 0.1;
                }
                else{
                    this._displacement.scale.y = 1;
                }
                element._sprite.filters = [this._displacement];
            }
        });
        
        return  {
            action: this._onUpdateAction,
            changeTo: this._nextScreen,
            params: this._nextScreenParams,
            playSound: this._sounds,
            sameMusic: true
        };
    }
}

export default ChapterChoose;