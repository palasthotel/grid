import React from 'react';

const ContainerSlots = ({slots})=>{
    return <div>
        {slots.map((el, key)=>{
            // TODO: calc width
            return <div>{el}</div>
        })}
    </div>
}

export default ContainerSlots;