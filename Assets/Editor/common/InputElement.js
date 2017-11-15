import React from 'react';

export default function InputElement(props){
    const {
        type,
        defaultValue,
        name,
        isDisabled,
        changeHandler
    } = props;

    switch(type){
        case "Number" : 
            return (
                <input
                    type="number"
                    name={name}
                    disabled={isDisabled}
                    defaultValue={defaultValue}
                    onChange={changeHandler}
                />
            );
        case "Text" : 
            return (
                <input
                    name={name}
                    disabled={isDisabled}
                    type="text"
                    defaultValue={defaultValue}
                    onChange={changeHandler}
                />
            );
        case "Boolean" :
            return (
                <input
                    name={name}
                    disabled={isDisabled}
                    type="checkbox"
                    defaultChecked={defaultValue}
                    onChange={changeHandler}
                />
            );
        default:
            throw new Error("No such input type");
    }
}