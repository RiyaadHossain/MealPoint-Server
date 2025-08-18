export const actualFilterField = (field: string, replaceWord: string) => {
    const actualField = field.replace(replaceWord, "").toLowerCase();
    return actualField
}