import BaseElement from './BaseElement';
    
class Image extends BaseElement{

    constructor(id, position, sprite){
        super(id, position, sprite);
        this._data.type = "image";
    };

    static get Properties(){
        return {
            
        };
    }

}
    
export default Image;