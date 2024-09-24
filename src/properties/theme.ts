import { Retool } from '@tryretool/custom-component-support'

export type RetoolFont = {
    fontWeight: string,
    size: string
}

export type RetoolThemeColors = {
    primary: string,
    secondary: string,
    tertiary: string,
    highlight: string,
    canvas: string,
    surfacePrimary: string,
    surfaceSecondary: string,
    info: string,
    success: string,
    warning: string,
    danger: string,
}

export type RetoolTheme = RetoolThemeColors & {
    defaultFont: RetoolFont,
    h1Font: RetoolFont,
    h2Font: RetoolFont,
    h3Font: RetoolFont,
    h4Font: RetoolFont,
    h5Font: RetoolFont,
    h6Font: RetoolFont,
    labelFont: RetoolFont,
    labelEmphasizedFont: RetoolFont,
    borderRadius: string,
}

export const useTheme = () => {
    const [theme] = Retool.useStateString({
        name: "theme",
        label: "Theme",
        initialValue: "{{ JSON.stringify(theme) }}",
        inspector: "hidden"
    })
    return { theme: JSON.parse(theme || '') as RetoolTheme }
}

export const useThemeFontFamily = () => {
    const [themeFontFamily] = Retool.useStateString({
        name: "themeFontFamily",
        label: "Font family",
        initialValue: "Inter var, Inter, -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif"
    })
    return { themeFontFamily }
}

export const useThemeFontSize = () => {
    const [themeFontSize] = Retool.useStateString({
        name: "themeFontSize",
        label: "Font size",
        initialValue: "{{ theme.defaultFont.size }}"
    })
    return { themeFontSize }
}

export const useThemeBorderRadius = () => {
    const [themeBorderRadius] = Retool.useStateString({
        name: "themeBorderRadius",
        label: "Border radius",
        initialValue: "{{ theme.borderRadius }}"
    })
    return { themeBorderRadius }
}

export const useThemeAvatarBorderRadius = () => {
    const [themeAvatarBorderRadius] = Retool.useStateString({
        name: "themeAvatarBorderRadius",
        label: "Avatar border radius",
        initialValue: "{{ theme.borderRadius }}"
    })
    return { themeAvatarBorderRadius }
}

export const useThemeColors = () => {
    let themeColors = {
        primary: Retool.useStateString({
            name: "themeColorPrimary",
            label: "Primary color",
            initialValue: "{{ theme.primary }}"
        })[0],
        highlight: Retool.useStateString({
            name: "themeColorHighlight",
            label: "Highlight color",
            initialValue: "{{ theme.highlight }}"
        })[0],
        canvas: Retool.useStateString({
            name: "themeColorCanvas",
            label: "Canvas color",
            initialValue: "{{ theme.canvas }}"
        })[0],
    };

    return { themeColors }
}

export const useThemeStyles = () => {
    const { themeFontFamily } = useThemeFontFamily(); 
    const { themeFontSize } = useThemeFontSize(); 
    const { themeBorderRadius } = useThemeBorderRadius(); 
    const { themeAvatarBorderRadius } = useThemeAvatarBorderRadius(); 
    const { themeColors } = useThemeColors(); 

    const themeStyles: React.CSSProperties & { [key: `--${string}`]: string } = {
        fontFamily: themeFontFamily,
        ['--wy-font-size']: themeFontSize,
        ['--wy-border-radius']: themeBorderRadius,
        ['--wy-avatar-border-radius']: themeAvatarBorderRadius,
        ['--wy-theme-color']: themeColors.primary,
      }

    return { themeStyles }
}