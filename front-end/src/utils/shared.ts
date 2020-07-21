// idk it will work or not
export const updateObject = (oldObject: {}, updatedProperties: {}): {} => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};
