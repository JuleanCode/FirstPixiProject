import React from "react";

export const ContextBridge = ({ children, Context, render }) => {
    return (
        <Context.Consumer>
            {(value) =>
                render(<Context.Provider value={value}>{children}</Context.Provider>)
            }
        </Context.Consumer>
    );
};