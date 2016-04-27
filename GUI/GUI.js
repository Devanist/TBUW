define([
    'GUI/Button',
    'GUI/Image',
    'GUI/Label'
], function(Button, Image, Label){
    
    /**
     * Kontener na elementy GUI.
     */
    var GUI = {
        Button: Button,
        Image: Image,
        Label: Label
    };
    
    return GUI;
    
});