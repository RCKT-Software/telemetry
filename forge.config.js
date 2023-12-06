module.exports = {
    packagerConfig: {
        appCopyright: "Copyright © 2023 RCKT Software, LLC.",
        icon: "./src/assets/icon",
        name: "Telemetry",
        win32metadata: {
            ProductName: "Telemetry"
        },
        osxSign: {},
        osxNotarize: {
            tool: 'notarytool',
            keychainProfile: 'telemetry'
        }
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Telemetry",
                copyright: "Copyright © 2023 RCKT Software, LLC.",
                iconUrl: "https://raw.githubusercontent.com/RCKT-Software/telemetry/main/public/icon.ico",
                setupIcon: "./src/assets/icon.ico",
                signWithParams: "/tr http://timestamp.sectigo.com /td sha256 /fd sha256 /a"
            }
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                icon: "./src/assets/icon.icns",
                name: "Telemetry",
                copyright: "Copyright © 2023 RCKT Software, LLC."
            }
        }

    ],
};
