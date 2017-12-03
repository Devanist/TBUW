import React from 'react';

export default function LoadFileButton (props) {
    return (
        <input id="loadFile" type="file" onChange={props.onChage} />
    );
}
