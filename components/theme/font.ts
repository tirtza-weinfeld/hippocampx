
export type Font =
    | "inter"
    | "dancing-script"
    | "pacifico"
    | "great-vibes"
    | "satisfy"
    | "tangerine"
    | "allura"
    | "kaushan-script"
    | "sacramento"
    | "roboto"
    | "open-sans"
    | "montserrat"


export function getFontFamily(font: Font): string {
    switch (font) {
        case "dancing-script":
            return "'Dancing Script', cursive"
        case "pacifico":
            return "'Pacifico', cursive"
        case "great-vibes":
            return "'Great Vibes', cursive"
        case "satisfy":
            return "'Satisfy', cursive"
        case "tangerine":
            return "'Tangerine', cursive"
        case "allura":
            return "'Allura', cursive"
        case "kaushan-script":
            return "'Kaushan Script', cursive"
        case "sacramento":
            return "'Sacramento', cursive"
        case "roboto":
            return "'Roboto', sans-serif"
        case "open-sans":
            return "'Open Sans', sans-serif"
        case "montserrat":
            return "'Montserrat', sans-serif"
        case "inter":
        default:
            return "var(--font-sans)"
    }
}
