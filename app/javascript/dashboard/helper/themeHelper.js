export const setColorTheme = isOSOnDarkMode => {
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('style', 'color-scheme: light;');
};
