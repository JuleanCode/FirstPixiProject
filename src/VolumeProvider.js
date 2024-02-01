import React, {createContext, useState} from "react";

export const VolumeContext = createContext(null)

function VolumeProvider({ children }) {
    const volumeThreshold = 5
    const [volume, setVolume] = useState( volumeThreshold);
    return (
            <VolumeContext.Provider
                value={{
                    volume,
                    setVolume,
                    volumeThreshold
                }}
            >
                {children}
            </VolumeContext.Provider>
    );
}

export default VolumeProvider