import { Stage as PixiStage } from '@pixi/react';
import { VolumeContext} from "./VolumeProvider";
import React from "react";
import {ContextBridge} from "./ContextBridge";


export const Stage = ({ children, ...props }) => {
    return (
        <ContextBridge
            Context={VolumeContext}
            render={(children) => <PixiStage {...props}>{children}</PixiStage>}
        >
            {children}
        </ContextBridge>
    );
};